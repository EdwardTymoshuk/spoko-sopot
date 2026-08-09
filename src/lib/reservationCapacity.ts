import type { PrismaClient } from '@prisma/client'

const SLOT_MINUTES = 30
const DAY_START_MINUTES = 10 * 60
const DAY_END_MINUTES = 23 * 60

const parseTime = (value: string | null | undefined) => {
  if (!value) return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const minutes = Number(match[1]) * 60 + Number(match[2])
  return Number.isFinite(minutes) ? minutes : null
}

const toRange = (start: string | null | undefined, end: string | null | undefined) => ({
  start: parseTime(start) ?? DAY_START_MINUTES,
  end: parseTime(end) ?? DAY_END_MINUTES,
})

const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.start < b.end && b.start < a.end

export async function validateReservationCapacity(
  prisma: PrismaClient,
  input: {
    dateKey: string
    startTime?: string | null
    endTime?: string | null
    guests: number
    adultGuests?: number
  },
) {
  const settings = await prisma.settings.findFirst({
    select: { reservationCapacity: true, reservationMinGuests: true },
  })
  const capacity = Math.max(1, settings?.reservationCapacity ?? 40)
  const minGuests = Math.max(1, settings?.reservationMinGuests ?? 12)

  if ((input.adultGuests ?? input.guests) < minGuests) {
    return { ok: false as const, reason: `Rezerwacje online są dostępne od ${minGuests} osób dorosłych.` }
  }
  if (input.guests > capacity) {
    return { ok: false as const, reason: `Jedna rezerwacja nie może przekraczać pojemności ${capacity} osób.` }
  }

  const dayStart = new Date(`${input.dateKey}T00:00:00.000Z`)
  const dayEnd = new Date(`${input.dateKey}T23:59:59.999Z`)
  const [blocked, reservations] = await Promise.all([
    prisma.calendarAvailability.findFirst({
      where: { date: { gte: dayStart, lte: dayEnd }, isBlocked: true },
      select: { notes: true },
    }),
    prisma.reservation.findMany({
      where: { eventDate: { gte: dayStart, lte: dayEnd }, status: { in: ['SENT', 'CONFIRMED'] } },
      select: {
        startTime: true,
        endTime: true,
        adultsCount: true,
        childrenCount: true,
        extras: { select: { label: true } },
      },
    }),
  ])

  if (blocked) return { ok: false as const, reason: blocked.notes || 'Wybrany dzień jest zablokowany.' }

  const requestedRange = toRange(input.startTime, input.endTime)
  for (let slotStart = DAY_START_MINUTES; slotStart < DAY_END_MINUTES; slotStart += SLOT_MINUTES) {
    const slot = { start: slotStart, end: slotStart + SLOT_MINUTES }
    if (!overlaps(slot, requestedRange)) continue

    const occupied = reservations.reduce((total, reservation) => {
      const exclusive = reservation.extras.some((extra) => extra.label === 'Wyłączność sali')
      if (exclusive) return capacity
      const range = toRange(reservation.startTime, reservation.endTime)
      if (!overlaps(slot, range)) return total
      return total + reservation.adultsCount + (reservation.childrenCount ?? 0)
    }, 0)

    if (occupied + input.guests > capacity) {
      return { ok: false as const, reason: `W wybranych godzinach pozostało miejsce dla maksymalnie ${Math.max(0, capacity - occupied)} osób.` }
    }
  }

  return { ok: true as const, capacity, minGuests }
}
