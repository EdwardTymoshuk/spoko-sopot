'use client'

import PriceCalendar from '@/app/components/reservation/calendar/PriceCalendar'
import { Card } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'
import type {
  CalendarAvailabilityVM,
  ChildrenMenuOption,
} from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { parseTimeToDecimalHour } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'

type AvailabilityApiItem = {
  date: string
  isBlocked: boolean
  basePriceFrom: number | null
  reason?: string | null
  occupancyRatio?: number | null
  occupiedGuestsPeak?: number | null
}

type AvailabilitySlotApiItem = {
  time: string
  occupiedGuests: number
  remainingCapacity: number
  isExclusive: boolean
  isBlocked: boolean
  reason?: string | null
}

type AvailabilityApiResponse = {
  days?: AvailabilityApiItem[]
  slots?: AvailabilitySlotApiItem[]
  capacity?: number
}

const KIDS_MENU_ITEMS = [
  'Mini bruschetta z pomidorem i mozzarellą',
  'Panierowane fileciki z kurczaka z frytkami i ketchupem',
  'Panierowane fileciki z dorsza z frytkami i ketchupem',
  'Mini pizza Margherita',
  'Grillowany filet z kurczaka z puree ziemniaczanym, marchewką i groszkiem',
]

const TIME_OPTIONS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
]

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type CounterProps = {
  value: number
  min?: number
  onChange: (value: number) => void
  ariaLabel: string
}

const Counter = ({ value, min = 0, onChange, ariaLabel }: CounterProps) => (
  <div className="flex items-center justify-center gap-4">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="h-10 w-10 rounded-md border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Zmniejsz ${ariaLabel}`}
    >
      <FiMinus className="mx-auto h-4 w-4" />
    </button>

    <div className="min-w-12 text-center text-3xl md:text-4xl font-serif tabular-nums">
      {value}
    </div>

    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="h-10 w-10 rounded-md border transition-colors hover:bg-muted"
      aria-label={`Zwiększ ${ariaLabel}`}
    >
      <FiPlus className="mx-auto h-4 w-4" />
    </button>
  </div>
)

type OptionCardProps = {
  selected: boolean
  title: string
  description: string
  hint?: string
  onClick: () => void
}

const OptionCard = ({
  selected,
  title,
  description,
  hint,
  onClick,
}: OptionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full rounded-xl border p-4 text-left transition-all',
      selected
        ? 'border-primary ring-2 ring-primary bg-primary/5'
        : 'border-border hover:border-primary/40'
    )}
  >
    <p className="font-semibold">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    {hint && <p className="mt-2 text-xs text-primary font-medium">{hint}</p>}
  </button>
)

const DateGuestsStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const [availability, setAvailability] = useState<CalendarAvailabilityVM[]>([])
  const [timeSlots, setTimeSlots] = useState<AvailabilitySlotApiItem[]>([])
  const [maxConcurrentGuests, setMaxConcurrentGuests] = useState(40)

  const adults = draft.adultsCount ?? 10
  const childrenUnder3 = draft.childrenUnder3Count ?? 0
  const children3to12 = draft.children3to12Count ?? 0
  const totalGuests = adults + childrenUnder3 + children3to12

  const shouldPickChildrenOption = children3to12 > 0
  const isChildrenOptionMissing =
    shouldPickChildrenOption && !draft.childrenMenuOption
  const startHour = parseTimeToDecimalHour(draft.eventStartTime)
  const endHour = parseTimeToDecimalHour(draft.eventEndTime)
  const isTimeRangeInvalid =
    startHour !== null && endHour !== null && endHour <= startHour

  const slotMap = useMemo(
    () => new Map(timeSlots.map((slot) => [slot.time, slot])),
    [timeSlots]
  )
  const timeIndexMap = useMemo(
    () => new Map(TIME_OPTIONS.map((time, index) => [time, index])),
    []
  )
  const requestedGuests = Math.max(1, totalGuests)

  const updateChildren312 = (value: number) => {
    const next = Math.max(0, value)
    updateDraft('children3to12Count', next)
    if (next === 0) {
      updateDraft('childrenMenuOption', null)
    }
  }

  const canHostGuestsInSlot = useCallback((slot?: AvailabilitySlotApiItem) => {
    if (!slot) return false
    if (slot.isExclusive || slot.isBlocked) return false
    return slot.remainingCapacity >= requestedGuests
  }, [requestedGuests])

  const canStartAtTime = useCallback((time: string) => {
    if (!draft.eventDate) return false
    const index = timeIndexMap.get(time)
    if (index === undefined || index >= TIME_OPTIONS.length - 1) return false
    return canHostGuestsInSlot(slotMap.get(time))
  }, [canHostGuestsInSlot, draft.eventDate, slotMap, timeIndexMap])

  const canEndAtTime = useCallback((time: string) => {
    if (!draft.eventDate || !draft.eventStartTime) return false

    const startIndex = timeIndexMap.get(draft.eventStartTime)
    const endIndex = timeIndexMap.get(time)
    if (
      startIndex === undefined ||
      endIndex === undefined ||
      endIndex <= startIndex
    ) {
      return false
    }

    for (let index = startIndex; index < endIndex; index += 1) {
      const slot = slotMap.get(TIME_OPTIONS[index])
      if (!canHostGuestsInSlot(slot)) return false
    }

    return true
  }, [
    canHostGuestsInSlot,
    draft.eventDate,
    draft.eventStartTime,
    slotMap,
    timeIndexMap,
  ])

  useEffect(() => {
    let cancelled = false

    const fetchAvailability = async () => {
      try {
        const params = new URLSearchParams()
        params.set('guests', String(Math.max(1, totalGuests)))
        if (draft.eventDate) {
          params.set('date', toDateKey(new Date(draft.eventDate)))
        }

        const res = await fetch(`/api/reservation-availability?${params.toString()}`, {
          cache: 'no-store',
        })

        if (!res.ok) return

        const payload = (await res.json()) as AvailabilityApiResponse
        const items = Array.isArray(payload.days) ? payload.days : []
        const slots = Array.isArray(payload.slots) ? payload.slots : []

        if (cancelled) return

        const nextAvailability: CalendarAvailabilityVM[] = []

        for (const item of items) {
          const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(item.date)
          const parsedDate = dateMatch
            ? new Date(
                Number(dateMatch[1]),
                Number(dateMatch[2]) - 1,
                Number(dateMatch[3])
              )
            : new Date(item.date)

          if (Number.isNaN(parsedDate.getTime())) continue

          nextAvailability.push({
            date: parsedDate,
            isBlocked: Boolean(item.isBlocked),
            basePriceFrom:
              typeof item.basePriceFrom === 'number' ? item.basePriceFrom : null,
            reason: item.reason ?? null,
            occupancyRatio:
              typeof item.occupancyRatio === 'number'
                ? item.occupancyRatio
                : null,
            occupiedGuestsPeak:
              typeof item.occupiedGuestsPeak === 'number'
                ? item.occupiedGuestsPeak
                : null,
          })
        }

        setAvailability(nextAvailability)
        setTimeSlots(slots)
        setMaxConcurrentGuests(
          typeof payload.capacity === 'number' && payload.capacity > 0
            ? payload.capacity
            : 40
        )
      } catch (error) {
        console.error('Błąd pobierania dostępności kalendarza:', error)
      }
    }

    void fetchAvailability()

    return () => {
      cancelled = true
    }
  }, [draft.eventDate, totalGuests])

  useEffect(() => {
    if (!draft.eventDate) {
      if (draft.eventStartTime) updateDraft('eventStartTime', null)
      if (draft.eventEndTime) updateDraft('eventEndTime', null)
      return
    }

    if (draft.eventStartTime && !canStartAtTime(draft.eventStartTime)) {
      updateDraft('eventStartTime', null)
      if (draft.eventEndTime) updateDraft('eventEndTime', null)
      return
    }

    if (draft.eventEndTime && !canEndAtTime(draft.eventEndTime)) {
      updateDraft('eventEndTime', null)
    }
  }, [
    canEndAtTime,
    canStartAtTime,
    draft.eventDate,
    draft.eventStartTime,
    draft.eventEndTime,
    updateDraft,
  ])

  const selectChildrenOption = (value: ChildrenMenuOption) => {
    updateDraft('childrenMenuOption', value)
  }

  const availableStartTimes = TIME_OPTIONS.filter((time) =>
    canStartAtTime(time)
  )
  const hasAnyStartSlot = availableStartTimes.length > 0
  const exceedsCapacity = requestedGuests > maxConcurrentGuests

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 px-3 pt-5 pb-4 md:p-6">
      <div className="space-y-1 px-1">
        <h2 className="text-xl md:text-2xl font-semibold">Data i liczba gości</h2>
        <p className="text-sm text-muted-foreground">
          Wybierz termin i podaj orientacyjną liczbę uczestników.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-4 md:gap-6 items-start">
        <Card className="p-4 md:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-semibold text-secondary">
              Wybierz datę
            </h3>
            <p className="text-sm text-muted-foreground">
              Sprawdź dostępność i cenę orientacyjną w kalendarzu.
            </p>
          </div>

          <PriceCalendar
            value={draft.eventDate ? new Date(draft.eventDate) : undefined}
            availability={availability}
            onChange={(date) => updateDraft('eventDate', date ?? null)}
          />

          <div className="rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/5 via-background to-background p-4 md:p-5 space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold">Godziny przyjęcia</h4>
              <p className="text-sm text-muted-foreground">
                Godziny są wyliczane automatycznie na podstawie aktualnych
                rezerwacji i dostępności sali.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Godzina rozpoczęcia
                </span>
                <div className="relative">
                  <select
                    className="h-11 w-full appearance-none rounded-xl border border-border/80 bg-background px-3 pr-9 text-sm shadow-sm"
                    value={draft.eventStartTime ?? ''}
                    onChange={(e) => {
                      updateDraft('eventStartTime', e.target.value || null)
                      updateDraft('eventEndTime', null)
                    }}
                    disabled={!draft.eventDate || exceedsCapacity || !hasAnyStartSlot}
                  >
                    <option value="">Wybierz</option>
                    {TIME_OPTIONS.map((time, index) => {
                      const disabled =
                        index >= TIME_OPTIONS.length - 1 || !canStartAtTime(time)

                      return (
                        <option key={time} value={time} disabled={disabled}>
                          {time}
                        </option>
                      )
                    })}
                  </select>
                  <MdKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Godzina zakończenia
                </span>
                <div className="relative">
                  <select
                    className="h-11 w-full appearance-none rounded-xl border border-border/80 bg-background px-3 pr-9 text-sm shadow-sm"
                    value={draft.eventEndTime ?? ''}
                    onChange={(e) =>
                      updateDraft('eventEndTime', e.target.value || null)
                    }
                    disabled={!draft.eventDate || !draft.eventStartTime || exceedsCapacity}
                  >
                    <option value="">Wybierz</option>
                    {TIME_OPTIONS.map((time) => {
                      const disabled = !canEndAtTime(time)
                      return (
                        <option key={time} value={time} disabled={disabled}>
                          {time}
                        </option>
                      )
                    })}
                  </select>
                  <MdKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
            </div>

            {!draft.eventDate && (
              <p className="text-sm text-muted-foreground">
                Najpierw wybierz datę w kalendarzu, aby zobaczyć dostępne
                godziny.
              </p>
            )}

            {exceedsCapacity && (
              <p className="text-sm text-destructive">
                Dla {requestedGuests} gości przekroczony jest limit formularza
                online ({maxConcurrentGuests} osób). Skontaktuj się z restauracją,
                aby ustalić indywidualne rozwiązanie.
              </p>
            )}

            {draft.eventDate && !exceedsCapacity && !hasAnyStartSlot && (
              <p className="text-sm text-destructive">
                Na ten dzień nie ma już dostępnych godzin dla {requestedGuests}{' '}
                gości. Wybierz inną datę.
              </p>
            )}

            {isTimeRangeInvalid && (
              <p className="text-sm text-destructive">
                Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Ceny są orientacyjne i dotyczą osoby dorosłej. Ostateczna wycena
            zależy od menu i wybranych dodatków.
          </p>
        </Card>

        <Card className="p-4 md:p-6 space-y-6">
          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-semibold text-secondary">
                Goście dorośli
              </h3>
              <p className="text-sm text-muted-foreground">
                Rezerwacje online realizujemy od 12 osób dorosłych.
              </p>
            </div>

            <Counter
              value={adults}
              min={1}
              onChange={(value) => updateDraft('adultsCount', value)}
              ariaLabel="liczbę dorosłych"
            />

            <div className="space-y-2">
              {adults < 12 ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  Rezerwacje online realizujemy od 12 osób dorosłych. Dla
                  mniejszych grup zapraszamy do kontaktu: 530 659 666.
                </div>
              ) : adults >= 8 ? (
                <div className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">
                  Dla grup od 8 osób doliczamy serwis 10% dla personelu.
                </div>
              ) : null}

              {adults >= 8 && adults < 12 && (
                <div className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
                  Serwis 10% doliczamy od 8 osób, ale formularz online wymaga
                  minimum 12 osób dorosłych.
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Osoby powyżej 8 roku życia traktujemy jako dorosłych.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-semibold text-secondary">
                Dzieci
              </h3>
              <p className="text-sm text-muted-foreground">
                0-3 lata: udział bezpłatny. 3-8 lat: wybór jednej z dwóch
                opcji rozliczenia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border p-4 space-y-3">
                <p className="font-medium">Dzieci 0-3 lata</p>
                <Counter
                  value={childrenUnder3}
                  onChange={(value) => updateDraft('childrenUnder3Count', value)}
                  ariaLabel="liczbę dzieci 0-3 lata"
                />
              </div>

              <div className="rounded-xl border p-4 space-y-3">
                <p className="font-medium">Dzieci 3-8 lat</p>
                <Counter
                  value={children3to12}
                  onChange={updateChildren312}
                  ariaLabel="liczbę dzieci 3-8 lat"
                />
              </div>
            </div>

            {shouldPickChildrenOption && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Wybierz opcję dla dzieci 3-8 lat
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <OptionCard
                    selected={draft.childrenMenuOption === 'half_package'}
                    title="Opcja 1: dzieci jedzą jak dorośli"
                    description="Rozliczenie jako 50% ceny wybranego pakietu dla dorosłych."
                    hint="Ta opcja jest doliczana automatycznie do sumy orientacyjnej."
                    onClick={() => selectChildrenOption('half_package')}
                  />

                  <OptionCard
                    selected={draft.childrenMenuOption === 'kids_menu'}
                    title="Opcja 2: specjalne menu dla dzieci"
                    description="Dedykowany zestaw dziecięcy z osobnej karty."
                    hint="Pozycja oznaczona jako wycena indywidualna."
                    onClick={() => selectChildrenOption('kids_menu')}
                  />
                </div>

                {draft.childrenMenuOption === 'kids_menu' && (
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="text-sm font-medium mb-2">
                      Proponowane menu dziecięce:
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {KIDS_MENU_ITEMS.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isChildrenOptionMissing && (
                  <p className="text-sm text-destructive">
                    Wybierz jedną opcję menu dla dzieci 3-8 lat, aby przejść
                    dalej.
                  </p>
                )}
              </div>
            )}
          </section>
        </Card>
      </div>
    </div>
  )
}

export default DateGuestsStep
