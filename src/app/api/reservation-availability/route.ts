import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const MAX_CONCURRENT_GUESTS = 40
const SLOT_MINUTES = 30
const DAY_START_MINUTES = 10 * 60
const DAY_END_MINUTES = 23 * 60

type AvailabilityDay = {
  date: string
  isBlocked: boolean
  basePriceFrom: number | null
  reason?: string | null
  occupancyRatio: number
  occupiedGuestsPeak: number
}

type AvailabilitySlot = {
  time: string
  occupiedGuests: number
  remainingCapacity: number
  isExclusive: boolean
  isBlocked: boolean
  reason?: string | null
}

type NormalizedReservation = {
  dateKey: string
  startTime: string | null
  endTime: string | null
  guests: number
  isExclusive: boolean
}

type IntervalLoad = {
  occupiedGuests: number
  isExclusive: boolean
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDateKey = (value: string | null): string => {
  if (!value) return ''
  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : ''
}

const parseRequestedGuests = (value: string | null) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 1
  return Math.max(1, Math.floor(parsed))
}

const guestWord = (count: number) => {
  if (count === 1) return 'osobę'
  if (count >= 2 && count <= 4) return 'osoby'
  return 'osób'
}

const isSeasonBlockedDateKey = (dateKey: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
  if (!match) return false
  const month = Number(match[2])
  return month === 7 || month === 8
}

const toTimeLabel = (minutes: number) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  const mins = String(minutes % 60).padStart(2, '0')
  return `${hours}:${mins}`
}

const TIME_BOUNDARIES: string[] = []
for (let minutes = DAY_START_MINUTES; minutes <= DAY_END_MINUTES; minutes += SLOT_MINUTES) {
  TIME_BOUNDARIES.push(toTimeLabel(minutes))
}
const SLOT_START_TIMES = TIME_BOUNDARIES.slice(0, -1)

const parseTimeToMinutes = (value: string | null): number | null => {
  if (!value) return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (
    Number.isNaN(hours) || Number.isNaN(minutes) ||
    hours < 0 || hours > 23 ||
    (minutes !== 0 && minutes !== 30)
  ) return null
  return hours * 60 + minutes
}

const createEmptyIntervals = (): IntervalLoad[] =>
  SLOT_START_TIMES.map(() => ({ occupiedGuests: 0, isExclusive: false }))

const toIntervalRange = (startTime: string | null, endTime: string | null) => {
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null
  if (startMinutes < DAY_START_MINUTES || endMinutes > DAY_END_MINUTES) return null

  const startOffset = startMinutes - DAY_START_MINUTES
  const endOffset = endMinutes - DAY_START_MINUTES
  if (startOffset % SLOT_MINUTES !== 0 || endOffset % SLOT_MINUTES !== 0) return null

  const startIndex = startOffset / SLOT_MINUTES
  const endIndex = endOffset / SLOT_MINUTES
  if (startIndex < 0 || endIndex > SLOT_START_TIMES.length || endIndex <= startIndex) return null

  return { startIndex, endIndex }
}

const applyReservationToIntervals = (
  intervals: IntervalLoad[],
  reservation: NormalizedReservation
) => {
  const range = toIntervalRange(reservation.startTime, reservation.endTime)

  if (!range && reservation.isExclusive) {
    for (const interval of intervals) {
      interval.isExclusive = true
      interval.occupiedGuests = MAX_CONCURRENT_GUESTS
    }
    return
  }

  if (!range) return

  for (let index = range.startIndex; index < range.endIndex; index++) {
    const interval = intervals[index]
    if (!interval) continue

    if (reservation.isExclusive) {
      interval.isExclusive = true
      interval.occupiedGuests = MAX_CONCURRENT_GUESTS
      continue
    }

    if (interval.isExclusive) continue

    interval.occupiedGuests = clamp(
      interval.occupiedGuests + reservation.guests,
      0,
      MAX_CONCURRENT_GUESTS
    )
  }
}

const buildIntervalsForDate = (reservations: NormalizedReservation[]) => {
  const intervals = createEmptyIntervals()
  for (const reservation of reservations) {
    applyReservationToIntervals(intervals, reservation)
  }
  return intervals
}

const summarizeDay = (intervals: IntervalLoad[], requestedGuests: number) => {
  const occupiedGuestsPeak = intervals.reduce((max, interval) => {
    const value = interval.isExclusive ? MAX_CONCURRENT_GUESTS : interval.occupiedGuests
    return Math.max(max, value)
  }, 0)

  const hasAvailableSlots = intervals.some((interval) => {
    if (interval.isExclusive) return false
    return MAX_CONCURRENT_GUESTS - interval.occupiedGuests >= requestedGuests
  })

  return {
    occupancyRatio: clamp(occupiedGuestsPeak / MAX_CONCURRENT_GUESTS, 0, 1),
    occupiedGuestsPeak,
    isBlocked: !hasAvailableSlots,
  }
}

const mapBlockedSlots = (reason: string): AvailabilitySlot[] =>
  SLOT_START_TIMES.map((time) => ({
    time,
    occupiedGuests: MAX_CONCURRENT_GUESTS,
    remainingCapacity: 0,
    isExclusive: true,
    isBlocked: true,
    reason,
  }))

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const selectedDateKey = parseDateKey(searchParams.get('date'))
  const requestedGuests = parseRequestedGuests(searchParams.get('guests'))

  try {
    // ── Manual blocked dates from PostgreSQL ─────────────────────────────────
    const manualBlockedRows = await prisma.calendarAvailability.findMany({
      where: { isBlocked: true },
      select: { date: true, notes: true },
    })

    const blockedDays = new Map<string, { reason: string; occupancyRatio: number; occupiedGuestsPeak: number }>()

    for (const row of manualBlockedRows) {
      const dateKey = toDateKey(row.date)
      if (!dateKey) continue
      blockedDays.set(dateKey, {
        reason: row.notes?.trim() || 'Termin zablokowany',
        occupancyRatio: 1,
        occupiedGuestsPeak: MAX_CONCURRENT_GUESTS,
      })
    }

    // ── Confirmed reservations from PostgreSQL ────────────────────────────────
    const confirmedReservations = await prisma.reservation.findMany({
      where: { status: { in: ['CONFIRMED', 'SENT'] } },
      select: {
        eventDate: true,
        startTime: true,
        endTime: true,
        adultsCount: true,
        childrenCount: true,
        extras: { select: { label: true } },
      },
    })

    const reservationsByDate = new Map<string, NormalizedReservation[]>()

    for (const r of confirmedReservations) {
      const dateKey = toDateKey(r.eventDate)
      if (!dateKey) continue

      const isExclusive = r.extras.some((extra) => extra.label === 'Wyłączność sali')

      const normalized: NormalizedReservation = {
        dateKey,
        startTime: r.startTime,
        endTime: r.endTime,
        guests: r.adultsCount + (r.childrenCount ?? 0),
        isExclusive,
      }

      const current = reservationsByDate.get(dateKey) ?? []
      current.push(normalized)
      reservationsByDate.set(dateKey, current)
    }

    // ── Build day map ─────────────────────────────────────────────────────────
    const dayMap = new Map<string, AvailabilityDay>()

    blockedDays.forEach((blocked, dateKey) => {
      dayMap.set(dateKey, {
        date: dateKey,
        isBlocked: true,
        basePriceFrom: null,
        reason: blocked.reason,
        occupancyRatio: blocked.occupancyRatio,
        occupiedGuestsPeak: blocked.occupiedGuestsPeak,
      })
    })

    reservationsByDate.forEach((reservations, dateKey) => {
      if (blockedDays.has(dateKey)) return

      const intervals = buildIntervalsForDate(reservations)
      const summary = summarizeDay(intervals, requestedGuests)

      dayMap.set(dateKey, {
        date: dateKey,
        isBlocked: summary.isBlocked,
        basePriceFrom: null,
        reason: summary.isBlocked
          ? 'Brak dostępnych godzin dla tej liczby gości'
          : null,
        occupancyRatio: summary.occupancyRatio,
        occupiedGuestsPeak: summary.occupiedGuestsPeak,
      })
    })

    // ── Slots for selected date ───────────────────────────────────────────────
    let slots: AvailabilitySlot[] = []
    if (selectedDateKey) {
      if (isSeasonBlockedDateKey(selectedDateKey)) {
        slots = mapBlockedSlots('W lipcu i sierpniu nie przyjmujemy eventów.')
      } else {
        const manualBlockedForDate = blockedDays.get(selectedDateKey)
        if (manualBlockedForDate) {
          slots = mapBlockedSlots(manualBlockedForDate.reason)
        } else {
          const reservations = reservationsByDate.get(selectedDateKey) ?? []
          const intervals = buildIntervalsForDate(reservations)

          slots = intervals.map((interval, index) => {
            const occupiedGuests = interval.isExclusive ? MAX_CONCURRENT_GUESTS : interval.occupiedGuests
            const remainingCapacity = Math.max(0, MAX_CONCURRENT_GUESTS - occupiedGuests)
            const isBlocked = interval.isExclusive || remainingCapacity < requestedGuests

            return {
              time: SLOT_START_TIMES[index],
              occupiedGuests,
              remainingCapacity,
              isExclusive: interval.isExclusive,
              isBlocked,
              reason: interval.isExclusive
                ? 'W tym czasie sala jest zarezerwowana na wyłączność.'
                : isBlocked
                ? remainingCapacity > 0
                  ? 'W tym czasie możemy przyjąć jeszcze maksymalnie ' + remainingCapacity + ' ' + guestWord(remainingCapacity) + '.'
                  : 'Ten czas jest już w pełni zarezerwowany.'
                : null,
            }
          })
        }
      }
    }

    const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({ days, slots, capacity: MAX_CONCURRENT_GUESTS })
  } catch (error) {
    console.error('Błąd pobierania dostępności:', error)
    return NextResponse.json(
      { days: [] as AvailabilityDay[], slots: [] as AvailabilitySlot[], capacity: MAX_CONCURRENT_GUESTS },
      { status: 500 }
    )
  }
}
