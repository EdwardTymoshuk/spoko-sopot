//src/app/types/reservation.ts

import { RESERVATION_STEPS } from '@/lib/consts'

export type PackageType = 'silver' | 'gold' | 'platinum'
export type SoupChoice = 'tomato_cream' | 'chicken_broth'
export type ChildrenMenuOption = 'half_package' | 'kids_menu'
export type CakeOption = 'own_cake' | 'need_bakery_contact' | 'skip'

// Cold plate – appetizer sets served per 6 guests
export type ColdPlateSelection = {
  [setId: string]: number
}

export type ColdPlateSaladSelection = {
  [saladId: string]: number
}

export type PremiumMainSelection = {
  [platterId: string]: number
}

export type PremiumMainSideSelection = {
  [sideId: string]: number
}

// src/app/types/reservation.ts
export type CalendarAvailabilityVM = {
  date: Date
  isBlocked: boolean
  basePriceFrom: number | null
}

export interface ReservationDraft {
  eventDate: Date | null
  adultsCount: number | null
  childrenUnder3Count?: number
  children3to12Count?: number
  childrenMenuOption?: ChildrenMenuOption | null

  packageType?: PackageType
  soupChoice?: SoupChoice | null
  wantsSoup?: boolean

  wantsExtension: boolean
  extensionHours: number

  servingStyle?: ServingStyle
  specialDiets?: SpecialDiet[]
  specialDietComment?: string

  // Selected cold plate sets (setId -> quantity)
  coldPlateSelections?: ColdPlateSelection
  coldPlateSaladSelections?: ColdPlateSaladSelection
  premiumMainSelections?: PremiumMainSelection
  premiumMainSideSelections?: PremiumMainSideSelection

  cakeOption?: CakeOption | null
}

export type ServingStyle = 'plated' | 'sharing' | 'combo'

export type SpecialDiet =
  | 'vegetarian'
  | 'lactose_free'
  | 'gluten_free'
  | 'other'

export type ReservationStepKey = (typeof RESERVATION_STEPS)[number]['key']
