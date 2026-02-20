import type { ReservationDraft } from '@/app/types/reservation'
import {
  COLD_PLATE_SALADS,
  COLD_PLATE_SETS,
  DESSERT_OPTIONS,
  PACKAGES,
  PREMIUM_MAIN_PLATTERS,
  PREMIUM_MAIN_SIDE_OPTIONS,
} from '@/lib/consts'
import { useMemo } from 'react'

const SERVICE_THRESHOLD = 8
const SERVICE_RATE = 0.1
const CHILDREN_HALF_PACKAGE_RATE = 0.5
const OWN_CAKE_FEE_PER_PERSON = 10

export const useReservationPricing = (draft: ReservationDraft) => {
  const adults = draft.adultsCount ?? 0
  const children3to12 = draft.children3to12Count ?? 0
  const childrenUnder3 = draft.childrenUnder3Count ?? 0

  const coldPlateTotal = useMemo(() => {
    const setsTotal = COLD_PLATE_SETS.reduce((sum, set) => {
      return sum + (draft.coldPlateSelections?.[set.id] ?? 0) * set.price
    }, 0)

    const saladsTotal = COLD_PLATE_SALADS.reduce((sum, salad) => {
      return sum + (draft.coldPlateSaladSelections?.[salad.id] ?? 0) * salad.price
    }, 0)

    return setsTotal + saladsTotal
  }, [draft.coldPlateSelections, draft.coldPlateSaladSelections])

  const premiumMainTotal = useMemo(() => {
    return PREMIUM_MAIN_PLATTERS.reduce((sum, platter) => {
      return sum + (draft.premiumMainSelections?.[platter.id] ?? 0) * platter.price
    }, 0)
  }, [draft.premiumMainSelections])

  const premiumMainSidesTotal = useMemo(() => {
    return PREMIUM_MAIN_SIDE_OPTIONS.reduce((sum, section) => {
      const sectionSum = section.options.reduce((acc, option) => {
        return (
          acc +
          (draft.premiumMainSideSelections?.[option.id] ?? 0) * option.price
        )
      }, 0)
      return sum + sectionSum
    }, 0)
  }, [draft.premiumMainSideSelections])

  const dessertsTotal = useMemo(() => {
    return DESSERT_OPTIONS.reduce((sum, option) => {
      return sum + (draft.dessertSelections?.[option.id] ?? 0) * option.price
    }, 0)
  }, [draft.dessertSelections])

  const selectedPackage = PACKAGES.find((p) => p.type === draft.packageType)

  if (!selectedPackage || adults === 0) {
    return {
      pricePerPerson: 0,
      packageTotal: 0,
      soupTotal: 0,
      extensionTotal: 0,
      children312Total: 0,
      serviceFee: 0,
      total: 0,
      coldPlateTotal: 0,
      premiumMainTotal: 0,
      premiumMainSidesTotal: 0,
      dessertsTotal: 0,
      cakeServiceTotal: 0,
    }
  }

  const pricePerPerson = selectedPackage.price
  const packageTotal = pricePerPerson * adults
  const children312Total =
    draft.childrenMenuOption === 'half_package'
      ? Math.ceil(children3to12 * pricePerPerson * CHILDREN_HALF_PACKAGE_RATE)
      : 0

  /* -------------------- SOUP -------------------- */

  let soupTotal = 0

  if (selectedPackage.details.soup) {
    const soupConfig = selectedPackage.details.soup

    if (soupConfig.mode === 'optional' && draft.wantsSoup) {
      const soupPrice = soupConfig.pricePerPerson ?? 0
      soupTotal = soupPrice * adults
    }
  }

  /* -------------------- EXTENSION -------------------- */

  let extensionTotal = 0

  if (draft.wantsExtension && draft.extensionHours > 0 && selectedPackage) {
    extensionTotal =
      selectedPackage.extensionPricePerHour * draft.extensionHours
  }

  /* -------------------- SERVICE -------------------- */

  const subtotal = packageTotal + soupTotal + extensionTotal + children312Total

  const serviceFee =
    adults >= SERVICE_THRESHOLD ? Math.round(subtotal * SERVICE_RATE) : 0

  const cakeServiceTotal =
    draft.cakeOption === 'own_cake'
      ? (adults + children3to12 + childrenUnder3) * OWN_CAKE_FEE_PER_PERSON
      : 0

  const total =
    subtotal +
    serviceFee +
    coldPlateTotal +
    premiumMainTotal +
    premiumMainSidesTotal +
    dessertsTotal +
    cakeServiceTotal

  return {
    pricePerPerson,
    packageTotal,
    soupTotal,
    extensionTotal,
    children312Total,
    serviceFee,
    total,
    coldPlateTotal,
    premiumMainTotal,
    premiumMainSidesTotal,
    dessertsTotal,
    cakeServiceTotal,
  }
}
