'use client'

import ReservationSummaryContent from '@/app/components/reservation/ReservationSummaryContent'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { useReservationPricing } from '@/app/utils/hooks/reservation/useReservationPricing'
import {
  ALCOHOL_OPTIONS,
  COLD_PLATE_SALADS,
  COLD_PLATE_SETS,
  DESSERT_OPTIONS,
  PACKAGES,
  PREMIUM_MAIN_PLATTERS,
  PREMIUM_MAIN_SIDE_OPTIONS,
  SOFT_DRINK_OPTIONS,
} from '@/lib/consts'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

type SummaryItem = { label: string; value: string }
type SummarySection = { title: string; items: SummaryItem[] }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const THANK_YOU_IMAGE = '/img/offer/IMG_6720.jpg'
const specialDietLabels: Record<string, string> = {
  vegetarian: 'wegetariańska',
  lactose_free: 'bez laktozy',
  gluten_free: 'bez glutenu',
  other: 'inne potrzeby',
}

const stripLeadingEmoji = (value: string) =>
  value.replace(/^[^A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]+/, '')

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    if (typeof window === 'undefined') return resolve()

    const img = new window.Image()
    const done = () => resolve()

    img.onload = done
    img.onerror = done
    img.src = src

    // Never block the flow for too long in case of slow network.
    window.setTimeout(done, 2500)
  })

const SummarySubmitStep = () => {
  const router = useRouter()
  const { draft, resetDraft, updateDraft } = useReservationDraft()
  const pricing = useReservationPricing(draft)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState(draft.summaryNotes ?? '')
  const [consentData, setConsentData] = useState(false)
  const [consentMarketing, setConsentMarketing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const sections = useMemo<SummarySection[]>(() => {
    const selectedPackage = PACKAGES.find((p) => p.type === draft.packageType)

    const details: SummaryItem[] = [
      {
        label: 'Data',
        value: draft.eventDate
          ? new Date(draft.eventDate).toLocaleDateString('pl-PL')
          : '—',
      },
      {
        label: 'Godziny',
        value:
          draft.eventStartTime && draft.eventEndTime
            ? `${draft.eventStartTime} - ${draft.eventEndTime}`
            : '—',
      },
      {
        label: 'Dorośli',
        value: String(draft.adultsCount ?? 0),
      },
      {
        label: 'Dzieci 0-3',
        value: String(draft.childrenUnder3Count ?? 0),
      },
      {
        label: 'Dzieci 3-8',
        value: String(draft.children3to12Count ?? 0),
      },
    ]

    if (draft.childrenMenuOption) {
      details.push({
        label: 'Menu dzieci 3-8',
        value:
          draft.childrenMenuOption === 'half_package'
            ? 'jak dorośli (50% pakietu)'
            : 'menu dziecięce',
      })
    }

    if (draft.cakeOption) {
      details.push({
        label: 'Tort',
        value:
          draft.cakeOption === 'own_cake'
            ? 'własny tort'
            : draft.cakeOption === 'need_bakery_contact'
            ? 'kontakt do cukierni'
            : 'bez tortu',
      })
    }

    if (draft.hallExclusivity) {
      details.push({
        label: 'Wyłączność sali',
        value: draft.hallExclusivity === 'yes' ? 'tak' : 'nie',
      })
    }

    if ((draft.specialDiets?.length ?? 0) > 0) {
      details.push({
        label: 'Potrzeby żywieniowe',
        value:
          draft.specialDiets
          ?.map((diet) => specialDietLabels[diet] ?? diet)
          .join(', ') ?? '',
      })
    }

    if (draft.specialDiets?.includes('other') && draft.specialDietComment?.trim()) {
      details.push({
        label: 'Szczegóły potrzeb żywieniowych',
        value: draft.specialDietComment.trim(),
      })
    }
    if (notes.trim()) {
      details.push({
        label: 'Uwagi',
        value: notes.trim(),
      })
    }

    const pricingItems: SummaryItem[] = []
    if (selectedPackage) {
      pricingItems.push({
        label: `Pakiet ${selectedPackage.title}`,
        value: `${pricing.packageTotal} zł`,
      })
    }
    if (pricing.children312Total > 0) {
      pricingItems.push({ label: 'Dzieci 3-8 (50% pakietu)', value: `+${pricing.children312Total} zł` })
    }
    if (pricing.soupTotal > 0) pricingItems.push({ label: 'Zupa', value: `+${pricing.soupTotal} zł` })
    if (pricing.coldPlateTotal > 0) pricingItems.push({ label: 'Zimna płyta', value: `+${pricing.coldPlateTotal} zł` })
    if (pricing.premiumMainTotal + pricing.premiumMainSidesTotal > 0) {
      pricingItems.push({
        label: 'Półmiski Premium',
        value: `+${pricing.premiumMainTotal + pricing.premiumMainSidesTotal} zł`,
      })
    }
    if (pricing.dessertsTotal > 0) pricingItems.push({ label: 'Desery', value: `+${pricing.dessertsTotal} zł` })
    if (pricing.softDrinksTotal > 0) pricingItems.push({ label: 'Napoje bezalkoholowe', value: `+${pricing.softDrinksTotal} zł` })
    if (pricing.alcoholTotal > 0) pricingItems.push({ label: 'Alkohol', value: `+${pricing.alcoholTotal} zł` })
    if (pricing.hallExclusivityTotal > 0) {
      pricingItems.push({
        label: 'Wyłączność sali',
        value: `+${pricing.hallExclusivityTotal} zł`,
      })
    }
    if (pricing.extensionTotal > 0) pricingItems.push({ label: 'Przedłużenie sali', value: `+${pricing.extensionTotal} zł` })
    if (pricing.serviceFee > 0) pricingItems.push({ label: 'Serwis 10%', value: `+${pricing.serviceFee} zł` })
    if (pricing.cakeServiceTotal > 0) pricingItems.push({ label: 'Opłata talerzykowa', value: `+${pricing.cakeServiceTotal} zł` })

    const selections: SummaryItem[] = []

    COLD_PLATE_SETS.forEach((item) => {
      const qty = draft.coldPlateSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })
    COLD_PLATE_SALADS.forEach((item) => {
      const qty = draft.coldPlateSaladSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })
    PREMIUM_MAIN_PLATTERS.forEach((item) => {
      const qty = draft.premiumMainSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })
    PREMIUM_MAIN_SIDE_OPTIONS.forEach((section) => {
      section.options.forEach((option) => {
        const qty = draft.premiumMainSideSelections?.[option.id] ?? 0
        if (qty > 0) selections.push({ label: stripLeadingEmoji(option.label), value: `x${qty}` })
      })
    })
    DESSERT_OPTIONS.forEach((item) => {
      const qty = draft.dessertSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })
    SOFT_DRINK_OPTIONS.forEach((item) => {
      const qty = draft.softDrinkSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })
    ALCOHOL_OPTIONS.forEach((item) => {
      const qty = draft.alcoholSelections?.[item.id] ?? 0
      if (qty > 0) selections.push({ label: stripLeadingEmoji(item.title), value: `x${qty}` })
    })

    const result: SummarySection[] = [
      { title: 'Szczegóły wydarzenia', items: details },
      { title: 'Wycena orientacyjna', items: [...pricingItems, { label: 'Suma', value: `${pricing.total} zł` }] },
    ]

    if (selections.length > 0) {
      result.push({ title: 'Wybrane pozycje', items: selections })
    }

    return result
  }, [draft, notes, pricing])

  const sendSummary = async () => {
    setError(null)

    if (!emailRegex.test(email.trim())) {
      setError('Podaj prawidłowy adres e-mail.')
      return
    }
    if (!consentData) {
      setError('Zaznacz zgodę na przetwarzanie danych, aby kontynuować.')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/reservation-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email.trim(),
          customerName: name.trim() || null,
          customerPhone: phone.trim() || null,
          customerNotes: notes.trim() || null,
          eventDateKey: draft.eventDate ? toDateKey(new Date(draft.eventDate)) : null,
          eventStartTime: draft.eventStartTime ?? null,
          eventEndTime: draft.eventEndTime ?? null,
          consentDataProcessing: consentData,
          consentMarketing,
          total: pricing.total,
          sections,
          reservationData: {
            adultsCount: draft.adultsCount ?? 1,
            childrenCount: draft.children3to12Count ?? 0,
            packageCode: draft.packageType
              ? (draft.packageType.toUpperCase() as 'SILVER' | 'GOLD' | 'PLATINUM')
              : null,
            pricePerPerson: pricing.pricePerPerson,
            subtotal: pricing.total - pricing.serviceFee,
            serviceFee: pricing.serviceFee,
          },
        }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error ?? 'Nie udało się wysłać podsumowania.')
      }

      resetDraft()
      await preloadImage(THANK_YOU_IMAGE)
      router.push('/reservation?step=thank-you')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas wysyłki.')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Podsumowanie oferty</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Sprawdź komplet informacji i zakończ formularz wysyłką podsumowania.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <Card className="p-5 md:p-6">
          <ReservationSummaryContent />
        </Card>

        <Card className="p-5 md:p-6 space-y-4 xl:sticky xl:top-24">
          <h3 className="text-lg font-semibold">Zakończ formularz</h3>
          <p className="text-sm text-muted-foreground">
            Wyślemy podsumowanie oferty w pliku PDF na podany adres e-mail.
          </p>

          <div className="space-y-2">
            <label htmlFor="summary-name" className="text-sm font-medium">
              Imię (opcjonalnie)
            </label>
            <Input
              id="summary-name"
              type="text"
              placeholder="np. Jan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary-phone" className="text-sm font-medium">
              Numer telefonu (opcjonalnie)
            </label>
            <Input
              id="summary-phone"
              type="tel"
              placeholder="np. +48 500 600 700"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary-email" className="text-sm font-medium">
              Adres e-mail
            </label>
            <Input
              id="summary-email"
              type="email"
              placeholder="np. jan.kowalski@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary-notes" className="text-sm font-medium">
              Uwagi (opcjonalnie)
            </label>
            <Textarea
              id="summary-notes"
              placeholder="Dodaj dodatkowe informacje do rezerwacji"
              value={notes}
              onChange={(e) => {
                const value = e.target.value
                setNotes(value)
                updateDraft('summaryNotes', value || null)
              }}
              rows={4}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={consentData}
                onCheckedChange={(checked) => setConsentData(Boolean(checked))}
              />
              <span>
                Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                <Link
                  href="/privacy-policy"
                  className="underline text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  polityką prywatności
                </Link>
                . (wymagane)
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={consentMarketing}
                onCheckedChange={(checked) =>
                  setConsentMarketing(Boolean(checked))
                }
              />
              <span>
                Chcę otrzymywać oferty specjalne i promocje od Restauracji
                Spoko (opcjonalnie).
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="button"
            onClick={sendSummary}
            disabled={status === 'sending'}
            className="w-full"
          >
            {status === 'sending'
              ? 'Wysyłanie...'
              : 'Zakończ i wyślij podsumowanie na e-mail'}
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default SummarySubmitStep
