import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const BLOCKING_REQUEST_STATUSES = ['accepted', 'confirmed', 'approved'] as const
const MAX_CONCURRENT_GUESTS = 35
const SLOT_MINUTES = 30
const DAY_START_MINUTES = 10 * 60
const DAY_END_MINUTES = 23 * 60

type SummaryItem = { label?: unknown; value?: unknown }
type SummarySection = { title?: unknown; items?: SummaryItem[] }

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

type ReservationRequestDoc = {
  eventDateKey?: unknown
  eventDate?: unknown
  eventStartTime?: unknown
  eventEndTime?: unknown
  guestCount?: unknown
  adultsCount?: unknown
  childrenUnder3Count?: unknown
  children3to12Count?: unknown
  hallExclusivity?: unknown
  sections?: SummarySection[]
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

const parseDate = (value: unknown): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

const parseDateKey = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : ''
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

const parseTimeToMinutes = (value: unknown): number | null => {
  if (typeof value !== 'string') return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    (minutes !== 0 && minutes !== 30)
  ) {
    return null
  }

  return hours * 60 + minutes
}

const parseCount = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value))
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.')
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0
  }

  return 0
}

const sectionValue = (
  sections: SummarySection[] | undefined,
  sectionTitle: string,
  itemLabel: string
) => {
  if (!Array.isArray(sections)) return ''

  const section = sections.find((item) => item.title === sectionTitle)
  const value = section?.items?.find((item) => item.label === itemLabel)?.value
  return typeof value === 'string' ? value.trim() : ''
}

const extractGuestsFromSections = (sections: SummarySection[] | undefined) => {
  const adults = parseCount(sectionValue(sections, 'Szczegóły wydarzenia', 'Dorośli'))
  const kids03 = parseCount(sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 0-3'))

  const kids38Raw = sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 3-8')
  const kids312Raw = sectionValue(sections, 'Szczegóły wydarzenia', 'Dzieci 3-12')
  const kids38 = parseCount(kids38Raw || kids312Raw)

  return adults + kids03 + kids38
}

const extractGuestCount = (doc: ReservationRequestDoc) => {
  const directGuestCount = parseCount(doc.guestCount)
  if (directGuestCount > 0) return directGuestCount

  const adults = parseCount(doc.adultsCount)
  const kids03 = parseCount(doc.childrenUnder3Count)
  const kids38 = parseCount(doc.children3to12Count)
  const directTotal = adults + kids03 + kids38
  if (directTotal > 0) return directTotal

  const sectionGuests = extractGuestsFromSections(doc.sections)
  return sectionGuests > 0 ? sectionGuests : 1
}

const extractExclusivity = (doc: ReservationRequestDoc) => {
  if (typeof doc.hallExclusivity === 'boolean') return doc.hallExclusivity
  if (typeof doc.hallExclusivity === 'string') {
    const value = doc.hallExclusivity.trim().toLowerCase()
    if (value === 'yes' || value === 'tak' || value === 'true') return true
  }

  const fromSections = sectionValue(
    doc.sections,
    'Szczegóły wydarzenia',
    'Wyłączność sali'
  )
    .trim()
    .toLowerCase()

  return fromSections === 'tak' || fromSections === 'yes' || fromSections === 'true'
}

const extractDateKey = (doc: ReservationRequestDoc) => {
  const directDateKey = parseDateKey(doc.eventDateKey)
  if (directDateKey) return directDateKey

  const parsedDate = parseDate(doc.eventDate)
  return parsedDate ? toDateKey(parsedDate) : ''
}

const createEmptyIntervals = (): IntervalLoad[] =>
  SLOT_START_TIMES.map(() => ({
    occupiedGuests: 0,
    isExclusive: false,
  }))

const toIntervalRange = (startTime: string | null, endTime: string | null) => {
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return null
  }
  if (startMinutes < DAY_START_MINUTES || endMinutes > DAY_END_MINUTES) {
    return null
  }

  const startOffset = startMinutes - DAY_START_MINUTES
  const endOffset = endMinutes - DAY_START_MINUTES
  if (startOffset % SLOT_MINUTES !== 0 || endOffset % SLOT_MINUTES !== 0) {
    return null
  }

  const startIndex = startOffset / SLOT_MINUTES
  const endIndex = endOffset / SLOT_MINUTES
  if (startIndex < 0 || endIndex > SLOT_START_TIMES.length || endIndex <= startIndex) {
    return null
  }

  return { startIndex, endIndex }
}

const applyReservationToIntervals = (
  intervals: IntervalLoad[],
  reservation: NormalizedReservation
) => {
  const range = toIntervalRange(reservation.startTime, reservation.endTime)

  // If there is no valid range and reservation has exclusivity,
  // treat it as an all-day exclusive block.
  if (!range && reservation.isExclusive) {
    for (const interval of intervals) {
      interval.isExclusive = true
      interval.occupiedGuests = MAX_CONCURRENT_GUESTS
    }
    return
  }

  if (!range) return

  for (let index = range.startIndex; index < range.endIndex; index += 1) {
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

const summarizeDay = (intervals: IntervalLoad[]) => {
  const occupiedGuestsPeak = intervals.reduce((max, interval) => {
    const value = interval.isExclusive
      ? MAX_CONCURRENT_GUESTS
      : interval.occupiedGuests
    return Math.max(max, value)
  }, 0)

  const hasAvailableSlots = intervals.some(
    (interval) => !interval.isExclusive && interval.occupiedGuests < MAX_CONCURRENT_GUESTS
  )

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
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      days: [] as AvailabilityDay[],
      slots: [] as AvailabilitySlot[],
      capacity: MAX_CONCURRENT_GUESTS,
    })
  }

  const { searchParams } = new URL(req.url)
  const selectedDateKey = parseDateKey(searchParams.get('date'))

  let client: MongoClient | null = null

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db()

    const blockedDays = new Map<
      string,
      { reason: string; occupancyRatio: number; occupiedGuestsPeak: number }
    >()

    const manualBlocked = await db
      .collection('ReservationBlockedDates')
      .find({ isBlocked: { $ne: false } })
      .project({ date: 1, day: 1, eventDate: 1, dateKey: 1, reason: 1 })
      .toArray()

    for (const item of manualBlocked) {
      const dateKey =
        parseDateKey(item.dateKey) ||
        parseDateKey(item.date) ||
        parseDateKey(item.day) ||
        (() => {
          const parsedDate =
            parseDate(item.date) ?? parseDate(item.day) ?? parseDate(item.eventDate)
          return parsedDate ? toDateKey(parsedDate) : ''
        })()

      if (!dateKey) continue

      blockedDays.set(dateKey, {
        reason:
          typeof item.reason === 'string' && item.reason.trim()
            ? item.reason.trim()
            : 'Termin zablokowany',
        occupancyRatio: 1,
        occupiedGuestsPeak: MAX_CONCURRENT_GUESTS,
      })
    }

    const rawRequests = (await db
      .collection('ReservationRequests')
      .find({ status: { $in: BLOCKING_REQUEST_STATUSES } })
      .project({
        eventDateKey: 1,
        eventDate: 1,
        eventStartTime: 1,
        eventEndTime: 1,
        guestCount: 1,
        adultsCount: 1,
        childrenUnder3Count: 1,
        children3to12Count: 1,
        hallExclusivity: 1,
        sections: 1,
      })
      .toArray()) as ReservationRequestDoc[]

    const reservationsByDate = new Map<string, NormalizedReservation[]>()

    for (const doc of rawRequests) {
      const dateKey = extractDateKey(doc)
      if (!dateKey) continue

      const normalized: NormalizedReservation = {
        dateKey,
        startTime:
          typeof doc.eventStartTime === 'string' ? doc.eventStartTime.trim() : null,
        endTime: typeof doc.eventEndTime === 'string' ? doc.eventEndTime.trim() : null,
        guests: extractGuestCount(doc),
        isExclusive: extractExclusivity(doc),
      }

      const current = reservationsByDate.get(dateKey) ?? []
      current.push(normalized)
      reservationsByDate.set(dateKey, current)
    }

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
      const summary = summarizeDay(intervals)

      dayMap.set(dateKey, {
        date: dateKey,
        isBlocked: summary.isBlocked,
        basePriceFrom: null,
        reason: summary.isBlocked ? 'Brak dostępnych godzin' : null,
        occupancyRatio: summary.occupancyRatio,
        occupiedGuestsPeak: summary.occupiedGuestsPeak,
      })
    })

    let slots: AvailabilitySlot[] = []
    if (selectedDateKey) {
      if (isSeasonBlockedDateKey(selectedDateKey)) {
        slots = mapBlockedSlots('W lipcu i sierpniu nie przyjmujemy eventów.')
      } else {
        const manualBlockedForSelectedDate = blockedDays.get(selectedDateKey)
        if (manualBlockedForSelectedDate) {
          slots = mapBlockedSlots(manualBlockedForSelectedDate.reason)
        } else {
          const reservations = reservationsByDate.get(selectedDateKey) ?? []
          const intervals = buildIntervalsForDate(reservations)

          slots = intervals.map((interval, index) => {
            const occupiedGuests = interval.isExclusive
              ? MAX_CONCURRENT_GUESTS
              : interval.occupiedGuests
            const remainingCapacity = Math.max(0, MAX_CONCURRENT_GUESTS - occupiedGuests)
            const isBlocked = interval.isExclusive || remainingCapacity <= 0

            return {
              time: SLOT_START_TIMES[index],
              occupiedGuests,
              remainingCapacity,
              isExclusive: interval.isExclusive,
              isBlocked,
              reason: interval.isExclusive
                ? 'Termin na wyłączność sali'
                : isBlocked
                ? 'Brak miejsc w tym czasie'
                : null,
            }
          })
        }
      }
    }

    const days = Array.from(dayMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )

    return NextResponse.json({
      days,
      slots,
      capacity: MAX_CONCURRENT_GUESTS,
    })
  } catch (error) {
    console.error('Błąd pobierania zajętych terminów rezerwacji:', error)
    return NextResponse.json(
      {
        days: [] as AvailabilityDay[],
        slots: [] as AvailabilitySlot[],
        capacity: MAX_CONCURRENT_GUESTS,
      },
      { status: 500 }
    )
  } finally {
    if (client) await client.close()
  }
}
