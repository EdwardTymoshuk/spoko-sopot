'use client'

import PriceCalendar from '@/app/components/reservation/calendar/PriceCalendar'
import { Card } from '@/app/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { Separator } from '@/app/components/ui/separator'
import type {
  CalendarAvailabilityVM,
  ChildrenMenuOption,
} from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { parseTimeToDecimalHour } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md'

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

type TimeSelectProps = {
  value: string | null
  placeholder?: string
  options: { time: string; disabled: boolean }[]
  disabled?: boolean
  onChange: (value: string | null) => void
}

const TimeSelect = ({
  value,
  placeholder = 'Wybierz',
  options,
  disabled = false,
  onChange,
}: TimeSelectProps) => {
  const [open, setOpen] = useState(false)
  const selectedRef = useRef<HTMLButtonElement>(null)

  const handleSelect = (time: string) => {
    onChange(time)
    setOpen(false)
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(v) => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-xl border border-border/80 bg-background px-3 pr-9 text-sm shadow-sm transition-colors',
            'relative text-left',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
            open && 'border-primary ring-2 ring-primary/30'
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={cn(!value && 'text-muted-foreground')}>
            {value ?? placeholder}
          </span>
          <MdKeyboardArrowDown
            className={cn(
              'absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-lg border overflow-hidden"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          selectedRef.current?.scrollIntoView({ block: 'center' })
        }}
      >
        <div
          role="listbox"
          className="
            max-h-60 overflow-y-auto overscroll-contain
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-zinc-300
          "
        >
          {options.map(({ time, disabled: optDisabled }) => {
            const selected = time === value
            return (
              <button
                key={time}
                ref={selected ? selectedRef : undefined}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={optDisabled}
                onClick={() => handleSelect(time)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors',
                  selected
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-foreground hover:bg-muted',
                  optDisabled && 'cursor-not-allowed opacity-35 hover:bg-transparent'
                )}
              >
                {time}
                {selected && <MdCheck className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DateGuestsStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const [availability, setAvailability] = useState<CalendarAvailabilityVM[]>([])
  const [timeSlots, setTimeSlots] = useState<AvailabilitySlotApiItem[]>([])
  const [maxConcurrentGuests, setMaxConcurrentGuests] = useState(40)
  const [slotsLoaded, setSlotsLoaded] = useState(false)

  const adults = draft.adultsCount ?? 10
  const childrenUnder3 = draft.childrenUnder3Count ?? 0
  const children3to12 = draft.children3to12Count ?? 0
  const totalGuests = adults + childrenUnder3 + children3to12
  const capacityGuests = adults + children3to12

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
  const requestedGuests = Math.max(1, capacityGuests)

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

  const getRangeCapacity = useCallback((startTime: string | null | undefined, endTime: string | null | undefined) => {
    if (!draft.eventDate || !startTime || !endTime) return null

    const startIndex = timeIndexMap.get(startTime)
    const endIndex = timeIndexMap.get(endTime)
    if (
      startIndex === undefined ||
      endIndex === undefined ||
      endIndex <= startIndex
    ) {
      return null
    }

    let minRemaining = Number.POSITIVE_INFINITY

    for (let index = startIndex; index < endIndex; index += 1) {
      const slot = slotMap.get(TIME_OPTIONS[index])
      if (!slot || slot.isExclusive) return 0
      minRemaining = Math.min(minRemaining, slot.remainingCapacity)
    }

    return Number.isFinite(minRemaining) ? Math.max(0, minRemaining) : null
  }, [draft.eventDate, slotMap, timeIndexMap])

  const canEndAtTime = useCallback((time: string) => {
    const rangeCapacity = getRangeCapacity(draft.eventStartTime, time)
    return rangeCapacity !== null && rangeCapacity >= requestedGuests
  }, [draft.eventStartTime, getRangeCapacity, requestedGuests])

  useEffect(() => {
    let cancelled = false
    setSlotsLoaded(false)

    const fetchAvailability = async () => {
      try {
        const params = new URLSearchParams()
        params.set('guests', String(Math.max(1, capacityGuests)))
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
        setSlotsLoaded(true)
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
  }, [capacityGuests, draft.eventDate])

  useEffect(() => {
    if (!draft.eventDate) {
      if (draft.eventStartTime) updateDraft('eventStartTime', null)
      if (draft.eventEndTime) updateDraft('eventEndTime', null)
    }
  }, [draft.eventDate, draft.eventStartTime, draft.eventEndTime, updateDraft])

  const selectChildrenOption = (value: ChildrenMenuOption) => {
    updateDraft('childrenMenuOption', value)
  }

  const availableStartTimes = TIME_OPTIONS.filter((time) =>
    canStartAtTime(time)
  )
  const hasAnyStartSlot = availableStartTimes.length > 0
  const exceedsCapacity = requestedGuests > maxConcurrentGuests
  const selectedRangeCapacity = slotsLoaded
    ? getRangeCapacity(draft.eventStartTime, draft.eventEndTime)
    : null
  const selectedRangeExceedsCapacity =
    selectedRangeCapacity !== null && requestedGuests > selectedRangeCapacity
  const shouldBlockStep = exceedsCapacity || selectedRangeExceedsCapacity

  useEffect(() => {
    if (draft.dateGuestsCapacityExceeded !== shouldBlockStep) {
      updateDraft('dateGuestsCapacityExceeded', shouldBlockStep)
    }
  }, [draft.dateGuestsCapacityExceeded, shouldBlockStep, updateDraft])

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

          <div className="rounded-2xl bg-gradient-to-b from-primary/5 via-background to-background p-4 md:p-5 space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold">Godziny przyjęcia</h4>
              <p className="text-sm text-muted-foreground">
                Godziny są wyliczane automatycznie na podstawie aktualnych
                rezerwacji i dostępności sali.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Godzina rozpoczęcia
                </span>
                <TimeSelect
                  value={draft.eventStartTime ?? null}
                  disabled={!draft.eventDate || exceedsCapacity || !hasAnyStartSlot}
                  options={TIME_OPTIONS.map((time, index) => ({
                    time,
                    disabled: index >= TIME_OPTIONS.length - 1 || !canStartAtTime(time),
                  }))}
                  onChange={(val) => {
                    updateDraft('eventStartTime', val)
                    updateDraft('eventEndTime', null)
                  }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Godzina zakończenia
                </span>
                <TimeSelect
                  value={draft.eventEndTime ?? null}
                  disabled={!draft.eventDate || !draft.eventStartTime || exceedsCapacity}
                  options={TIME_OPTIONS.map((time) => ({
                    time,
                    disabled: !canEndAtTime(time),
                  }))}
                  onChange={(val) => updateDraft('eventEndTime', val)}
                />
              </div>
            </div>

            {!draft.eventDate && (
              <p className="text-sm text-muted-foreground">
                Najpierw wybierz datę w kalendarzu, aby zobaczyć dostępne
                godziny.
              </p>
            )}

            {exceedsCapacity && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                Rezerwacje online przyjmujemy dla maksymalnie {maxConcurrentGuests}{' '}
                osób liczonych do pojemności sali. Dzieci do 3 lat nie wliczają
                się do tego limitu. Jeśli planujesz większe przyjęcie,
                skontaktuj się z nami - sprawdzimy możliwości i przygotujemy
                indywidualne rozwiązanie.
              </div>
            )}

            {draft.eventDate && !exceedsCapacity && !hasAnyStartSlot && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Dla wybranej liczby gości nie mamy już wolnego przedziału
                godzinowego w tym dniu. Wybierz inną datę albo zmień liczbę
                gości.
              </div>
            )}

            {!exceedsCapacity && selectedRangeExceedsCapacity && draft.eventStartTime && draft.eventEndTime && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                W godzinach {draft.eventStartTime}-{draft.eventEndTime} możemy
                przyjąć maksymalnie {selectedRangeCapacity} osób liczonych do
                pojemności sali, czyli dorosłych i dzieci powyżej 3 lat. Wybierz
                inny przedział czasowy albo zmień liczbę gości.
              </div>
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
