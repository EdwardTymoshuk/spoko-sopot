import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type SummaryItem = { label: string; value: string }
type SummarySection = { title: string; items: SummaryItem[] }

type ReservationSummaryPayload = {
  customerEmail?: string
  customerName?: string | null
  customerPhone?: string | null
  consentDataProcessing?: boolean
  consentMarketing?: boolean
  total?: number
  sections?: SummarySection[]
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isProd = process.env.NODE_ENV === 'production'

const toPdfSafeText = (value: string) => {
  const polishMap: Record<string, string> = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z',
  }

  return value
    .split('')
    .map((char) => polishMap[char] ?? char)
    .join('')
}

const buildTextSummary = (sections: SummarySection[], total: number) => {
  const lines: string[] = []

  lines.push('Podsumowanie oferty - Restauracja Spoko Sopot')
  lines.push('')

  for (const section of sections) {
    lines.push(section.title)
    for (const item of section.items) {
      lines.push(`- ${item.label}: ${item.value}`)
    }
    lines.push('')
  }

  lines.push(`Suma orientacyjna: ${total} zł`)
  return lines.join('\n')
}

const generatePdfBuffer = async (sections: SummarySection[], total: number) => {
  const doc = await PDFDocument.create()
  let page = doc.addPage([595.28, 841.89]) // A4 in points
  const pageWidth = page.getWidth()
  const marginX = 56
  const marginTop = 56
  const marginBottom = 56

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  let y = page.getHeight() - marginTop

  const addPageIfNeeded = (requiredHeight: number) => {
    if (y - requiredHeight < marginBottom) {
      page = doc.addPage([595.28, 841.89])
      y = page.getHeight() - marginTop
    }
  }

  const drawLine = (
    text: string,
    size: number,
    opts?: { bold?: boolean; color?: [number, number, number] }
  ) => {
    const safeText = toPdfSafeText(text)
    addPageIfNeeded(size + 6)
    page.drawText(safeText, {
      x: marginX,
      y,
      size,
      font: opts?.bold ? fontBold : fontRegular,
      color: rgb(
        ...(opts?.color
          ? opts.color
          : ([0.12, 0.12, 0.12] as [number, number, number]))
      ),
    })
    y -= size + 6
  }

  drawLine('Podsumowanie oferty', 20, { bold: true, color: [0.07, 0.07, 0.07] })
  drawLine('Restauracja Spoko Sopot', 11, { color: [0.4, 0.4, 0.4] })
  y -= 8

  for (const section of sections) {
    drawLine(section.title, 13, { bold: true, color: [0.07, 0.07, 0.07] })
    for (const item of section.items) {
      drawLine(`${item.label}: ${item.value}`, 10)
    }
    y -= 6
  }

  drawLine(`Suma orientacyjna: ${total} zł`, 14, {
    bold: true,
    color: [0.07, 0.07, 0.07],
  })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ReservationSummaryPayload

    const customerEmail = body.customerEmail?.trim() ?? ''
    const customerName = body.customerName?.trim() ?? ''
    const customerPhone = body.customerPhone?.trim() ?? ''
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
    const adminRecipient = (
      process.env.RECIPIENT_EMAIL?.trim() || 'info@spokosopot.pl'
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
    const summaryText = buildTextSummary(sections, total)
    const customerBlock = [
      `Adres e-mail: ${customerEmail}`,
      `Imię: ${customerName || '—'}`,
      `Telefon: ${customerPhone || '—'}`,
      `Zgoda marketingowa: ${consentMarketing ? 'tak' : 'nie'}`,
      '',
    ].join('\n')
    const pdfBuffer = await generatePdfBuffer(sections, total)

    const pdfName = `podsumowanie-oferty-spoko-${Date.now()}.pdf`

    await transporter.sendMail({
      from: `"Restauracja Spoko" <${smtpUser}>`,
      to: customerEmail,
      subject: 'Podsumowanie oferty - Restauracja Spoko Sopot',
      text: `${customerBlock}${summaryText}\n\nDziękujemy za wypełnienie formularza.`,
      attachments: [
        {
          filename: pdfName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    await transporter.sendMail({
      from: `"Restauracja Spoko" <${smtpUser}>`,
      to: adminRecipient,
      replyTo: customerEmail,
      subject: `Nowe podsumowanie oferty - ${customerEmail}`,
      text: `${customerBlock}${summaryText}`,
      attachments: [
        {
          filename: pdfName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    if (consentMarketing && process.env.MONGODB_URI) {
      try {
        const client = await MongoClient.connect(process.env.MONGODB_URI)
        const db = client.db()
        await db.collection('MarketingLeads').updateOne(
          { email: customerEmail.toLowerCase() },
          {
            $set: {
              email: customerEmail.toLowerCase(),
              name: customerName || null,
              phone: customerPhone || null,
              consentMarketing: true,
              source: 'reservation-summary',
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true }
        )
        await client.close()
      } catch (dbError) {
        console.error('Marketing lead save error:', dbError)
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
