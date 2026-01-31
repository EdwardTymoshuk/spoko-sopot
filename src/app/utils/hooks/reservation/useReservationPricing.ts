import type { ReservationDraft } from '@/app/types/reservation'

const SERVICE_THRESHOLD = 8
const SERVICE_RATE = 0.1

export const useReservationPricing = (draft: ReservationDraft) => {
  const adults = draft.adultsCount ?? 0

  const pricePerPerson = draft.eventDate
    ? getBasePriceForDate(new Date(draft.eventDate))
    : 0

  const baseTotal = pricePerPerson * adults

  const serviceFee =
    adults >= SERVICE_THRESHOLD ? Math.round(baseTotal * SERVICE_RATE) : 0

  const total = baseTotal + serviceFee

  return {
    pricePerPerson,
    serviceFee,
    total,
  }
}

// tymczasowo – masz już to gdzieś
const getBasePriceForDate = (date: Date): number => {
  const day = date.getDay()
  return day === 5 || day === 6 ? 350 : 250
}
