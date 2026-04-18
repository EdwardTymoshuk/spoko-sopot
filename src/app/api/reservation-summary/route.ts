import { prisma } from '@/lib/prisma'
import { PackageCode } from '@prisma/client'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { generateReservationSummaryPdf } from './pdfTemplate'

type SummaryItem = { label: string; value: string }
type SummarySection = { title: string; items: SummaryItem[] }

type ReservationData = {
  adultsCount: number
  childrenCount: number
  packageCode: 'SILVER' | 'GOLD' | 'PLATINUM' | null
  pricePerPerson: number
  subtotal: number
  serviceFee: number
}

type ReservationSummaryPayload = {
  customerEmail?: string
  customerName?: string | null
  customerPhone?: string | null
  customerNotes?: string | null
  eventDateKey?: string | null
  eventStartTime?: string | null
  eventEndTime?: string | null
  consentDataProcessing?: boolean
  consentMarketing?: boolean
  total?: number
  sections?: SummarySection[]
  reservationData?: ReservationData
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isProd = process.env.NODE_ENV === 'production'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const sectionValue = (
  sections: SummarySection[],
  sectionTitle: string,
  itemLabel: string
) =>
  sections
    .find((section) => section.title === sectionTitle)
    ?.items.find((item) => item.label === itemLabel)?.value ?? '—'

const generatePdfBuffer = async (sections: SummarySection[], total: number) =>
  generateReservationSummaryPdf(sections, total)

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ReservationSummaryPayload

    const customerEmail = body.customerEmail?.trim() ?? ''
    const customerName = body.customerName?.trim() ?? ''
    const customerPhone = body.customerPhone?.trim() ?? ''
    const customerNotes = body.customerNotes?.trim() ?? ''
    const eventDateKey = body.eventDateKey?.trim() ?? ''
    const eventStartTime = body.eventStartTime?.trim() ?? ''
    const eventEndTime = body.eventEndTime?.trim() ?? ''
    const consentDataProcessing = body.consentDataProcessing === true
    const consentMarketing = body.consentMarketing === true
    const total = typeof body.total === 'number' ? body.total : null
    const sections = Array.isArray(body.sections) ? body.sections : []

    if (!customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: 'Podaj poprawny adres e-mail.' },
        { status: 400 }
      )
    }
    if (!consentDataProcessing) {
      return NextResponse.json(
        { error: 'Wymagana jest zgoda na przetwarzanie danych.' },
        { status: 400 }
      )
    }

    if (total === null || sections.length === 0) {
      return NextResponse.json(
        { error: 'Brak danych podsumowania do wysyłki.' },
        { status: 400 }
      )
    }

    const smtpHost = process.env.SMTP_HOST?.trim()
    const smtpPortRaw = process.env.SMTP_PORT?.trim()
    const smtpUser = process.env.EMAIL_USER?.trim()
    const smtpPass = process.env.EMAIL_PASSWORD?.trim()
    const configuredRecipient = process.env.RECIPIENT_EMAIL?.trim() || ''
    const primaryAdminRecipient = 'info@spokosopot.pl'
    const ccAdminRecipient =
      configuredRecipient &&
      configuredRecipient.toLowerCase() !== primaryAdminRecipient
        ? configuredRecipient
        : undefined
    const adminFallbackRecipient =
      process.env.ADMIN_FALLBACK_EMAIL?.trim() || 'lesia.cheff@gmail.com'
    const adminFromAddress =
      process.env.RESERVATION_ADMIN_FROM?.trim() || 'rezerwacja@spokosopot.pl'
    const adminRecipients = Array.from(
      new Set(
        [
          primaryAdminRecipient,
          ccAdminRecipient,
          adminFallbackRecipient,
        ].filter((value): value is string => Boolean(value))
      )
    )
    const adminCcRecipients = adminRecipients.filter(
      (address) => address !== primaryAdminRecipient
    )

    if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          error:
            'Brak konfiguracji e-mail (SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD).',
        },
        { status: 500 }
      )
    }

    const smtpPort = parseInt(smtpPortRaw, 10)
    const transportOptions: SMTPTransport.Options = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPortRaw === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }

    const transporter = nodemailer.createTransport(transportOptions)
    await transporter.verify()
    const pdfBuffer = await generatePdfBuffer(sections, total)

    const pdfName = `podsumowanie-oferty-spoko-${Date.now()}.pdf`

    const managerDate = sectionValue(sections, 'Szczegóły wydarzenia', 'Data')
    const managerHours = sectionValue(sections, 'Szczegóły wydarzenia', 'Godziny')
    const managerAdults = sectionValue(sections, 'Szczegóły wydarzenia', 'Dorośli')
    const managerKids03 = sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 0-3')
    const managerKids312 =
      sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 3-8') !== '—'
        ? sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 3-8')
        : sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 3-12')
    const managerNotes = customerNotes || sectionValue(sections, 'Szczegóły wydarzenia', 'Uwagi')

    const customerDisplayName = customerName || 'Dzień dobry'
    const footerHtml = `
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
      <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
        Restauracja Spoko Sopot<br/>
        Hestii 3, 81-731 Sopot<br/>
        tel. <a href="tel:+48530659666" style="color:#6b7280;">+48 530 659 666</a> |
        e-mail <a href="mailto:info@spokosopot.pl" style="color:#6b7280;">info@spokosopot.pl</a>
      </p>
    `

    const customerHtml = `
      <div style="max-width:680px;margin:0 auto;padding:24px 20px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
        <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;">Podsumowanie formularza rezerwacji</h1>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.65;">
          ${escapeHtml(customerDisplayName)}, dziękujemy za przesłanie formularza.
        </p>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.65;">
          W załączniku przesyłamy podsumowanie Twojej konfiguracji wydarzenia.
        </p>
        <p style="margin:0;font-size:15px;line-height:1.65;">
          Skontaktujemy się z Tobą możliwie najszybciej, aby potwierdzić szczegóły.
        </p>
        ${footerHtml}
      </div>
    `

    const customerText = [
      'Podsumowanie formularza rezerwacji',
      '',
      `${customerDisplayName}, dziękujemy za przesłanie formularza.`,
      'W załączniku przesyłamy podsumowanie Twojej konfiguracji wydarzenia.',
      'Skontaktujemy się z Tobą możliwie najszybciej, aby potwierdzić szczegóły.',
      '',
      'Restauracja Spoko Sopot',
      'tel. +48 530 659 666',
      'info@spokosopot.pl',
    ].join('\n')

    const adminHtml = `
      <div style="max-width:720px;margin:0 auto;padding:24px 20px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;">Nowy formularz rezerwacji</h1>
        <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">
          Otrzymano nowe zgłoszenie przez konfigurator rezerwacji.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tbody>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:42%;">E-mail klienta</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(customerEmail)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Imię</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(customerName || '—')}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Telefon</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(customerPhone || '—')}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Uwagi</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerNotes || '—')}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Zgoda marketingowa</td><td style="padding:8px;border:1px solid #e5e7eb;">${consentMarketing ? 'tak' : 'nie'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Data wydarzenia</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerDate)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Godziny</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerHours)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Dorośli</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerAdults)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Dzieci 0-3</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerKids03)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Dzieci 3-8</td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(managerKids312)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Suma orientacyjna</td><td style="padding:8px;border:1px solid #e5e7eb;"><strong>${total} zł</strong></td></tr>
          </tbody>
        </table>
        ${footerHtml}
      </div>
    `

    const adminText = [
      'Nowy formularz rezerwacji',
      '',
      `E-mail klienta: ${customerEmail}`,
      `Imię: ${customerName || '—'}`,
      `Telefon: ${customerPhone || '—'}`,
      `Uwagi: ${managerNotes || '—'}`,
      `Zgoda marketingowa: ${consentMarketing ? 'tak' : 'nie'}`,
      '',
      `Data wydarzenia: ${managerDate}`,
      `Godziny: ${managerHours}`,
      `Dorośli: ${managerAdults}`,
      `Dzieci 0-3: ${managerKids03}`,
      `Dzieci 3-8: ${managerKids312}`,
      `Suma orientacyjna: ${total} zł`,
      '',
      'Pełne podsumowanie znajduje się w załączniku PDF.',
      '',
      'Restauracja Spoko Sopot',
      'tel. +48 530 659 666',
      'info@spokosopot.pl',
    ].join('\n')

    const customerMailInfo = await transporter.sendMail({
      from: `"Restauracja Spoko" <${smtpUser}>`,
      to: customerEmail,
      subject: 'Dziękujemy - podsumowanie formularza rezerwacji',
      text: customerText,
      html: customerHtml,
      attachments: [
        {
          filename: pdfName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })
    console.info('Reservation summary customer mail', {
      to: customerEmail,
      accepted: customerMailInfo.accepted,
      rejected: customerMailInfo.rejected,
      response: customerMailInfo.response,
      messageId: customerMailInfo.messageId,
    })

    const adminMailInfo = await transporter.sendMail({
      from: `"Formularz rezerwacji Spoko" <${adminFromAddress}>`,
      to: primaryAdminRecipient,
      cc: adminCcRecipients.length > 0 ? adminCcRecipients.join(', ') : undefined,
      envelope: {
        from: adminFromAddress,
        to: adminRecipients,
      },
      replyTo: customerEmail,
      subject: `Nowy formularz rezerwacji - ${customerEmail}`,
      text: adminText,
      html: adminHtml,
      attachments: [
        {
          filename: pdfName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })
    console.info('Reservation summary admin mail', {
      to: primaryAdminRecipient,
      cc: adminCcRecipients.length > 0 ? adminCcRecipients.join(', ') : undefined,
      fallback: adminFallbackRecipient,
      accepted: adminMailInfo.accepted,
      rejected: adminMailInfo.rejected,
      response: adminMailInfo.response,
      messageId: adminMailInfo.messageId,
    })

    const customerRejected = customerMailInfo.rejected?.length ?? 0
    if (customerRejected > 0 || (customerMailInfo.accepted?.length ?? 0) === 0) {
      throw new Error('Serwer SMTP odrzucił wysyłkę do klienta.')
    }

    const adminRejected = adminMailInfo.rejected?.length ?? 0
    if (adminRejected > 0 || (adminMailInfo.accepted?.length ?? 0) === 0) {
      throw new Error(
        `Serwer SMTP odrzucił wysyłkę do restauracji (${primaryAdminRecipient}).`
      )
    }

    // ── Save to PostgreSQL ────────────────────────────────────────────────────
    if (eventDateKey) {
      try {
        const rd = body.reservationData
        const packageCode =
          rd?.packageCode && rd.packageCode in PackageCode
            ? PackageCode[rd.packageCode]
            : null

        // Compute event duration in hours from start/end time (fallback: 5h)
        const durationHours = (() => {
          if (!eventStartTime || !eventEndTime) return 5
          const [sh, sm] = eventStartTime.split(':').map(Number)
          const [eh, em] = eventEndTime.split(':').map(Number)
          const diff = (eh * 60 + em - (sh * 60 + sm)) / 60
          return diff > 0 ? Math.round(diff) : 5
        })()

        await prisma.reservation.create({
          data: {
            status: 'SENT',
            eventDate: new Date(eventDateKey),
            startTime: eventStartTime || null,
            endTime: eventEndTime || null,
            adultsCount: rd?.adultsCount ?? 1,
            childrenCount: rd?.childrenCount ?? 0,
            eventType: 'OTHER',
            contact: {
              create: {
                name: customerName || '—',
                phone: customerPhone || '—',
                email: customerEmail,
                notes: customerNotes || null,
              },
            },
            ...(packageCode && rd
              ? {
                  offerSnapshot: {
                    create: {
                      packageCode,
                      servingType: 'standard',
                      basePricePerAdult: rd.pricePerPerson,
                      durationHours,
                      subtotal: rd.subtotal,
                      serviceFee: rd.serviceFee,
                      total: total ?? 0,
                    },
                  },
                }
              : {}),
          },
        })
      } catch (dbError) {
        console.error('Błąd zapisu rezerwacji do PostgreSQL:', dbError)
      }
    }

    return NextResponse.json({ message: 'Podsumowanie zostało wysłane.' })
  } catch (error) {
    console.error('Reservation summary email error:', error)
    const details =
      error instanceof Error ? error.message : 'Nieznany błąd serwera'
    return NextResponse.json(
      {
        error: isProd
          ? 'Nie udało się wysłać podsumowania.'
          : `Nie udało się wysłać podsumowania. ${details}`,
      },
      { status: 500 }
    )
  }
}
