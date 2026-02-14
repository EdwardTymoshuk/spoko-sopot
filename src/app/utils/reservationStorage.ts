import { ReservationDraft } from '@/app/types/reservation'

const STORAGE_KEY = 'reservation_draft'

const DEFAULT_DRAFT: ReservationDraft = {
  eventDate: null,
  adultsCount: 8,
  childrenUnder3Count: 0,
  children3to12Count: 0,
  childrenMenuOption: null,
  wantsExtension: false,
  extensionHours: 0,
}

export const getReservationDraft = (): ReservationDraft => {
  if (typeof window === 'undefined') {
    return DEFAULT_DRAFT
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_DRAFT, ...JSON.parse(raw) } : DEFAULT_DRAFT
  } catch {
    return DEFAULT_DRAFT
  }
}

export const saveReservationDraft = (data: ReservationDraft) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
