import { RESERVATION_STEPS } from '@/lib/consts'

// src/app/types/reservation.ts
export type CalendarAvailabilityVM = {
  date: Date
  isBlocked: boolean
  basePriceFrom: number | null
}

export type ReservationDraft = {
  eventDate?: string
  adultsCount: number
}

export type ReservationStepKey = (typeof RESERVATION_STEPS)[number]['key']
