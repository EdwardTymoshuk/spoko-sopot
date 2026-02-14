import type { ReservationDraft } from '@/app/types/reservation'
import { COLD_PLATE_SALADS, COLD_PLATE_SETS, PACKAGES } from '@/lib/consts'
import { useMemo } from 'react'

const SERVICE_THRESHOLD = 8
const SERVICE_RATE = 0.1
const CHILDREN_HALF_PACKAGE_RATE = 0.5

export const useReservationPricing = (draft: ReservationDraft) => {
  const adults = draft.adultsCount ?? 0
  const children3to12 = draft.children3to12Count ?? 0

  const coldPlateTotal = useMemo(() => {
    const setsTotal = COLD_PLATE_SETS.reduce((sum, set) => {
      return sum + (draft.coldPlateSelections?.[set.id] ?? 0) * set.price
    }, 0)

    const saladsTotal = COLD_PLATE_SALADS.reduce((sum, salad) => {
      return sum + (draft.coldPlateSaladSelections?.[salad.id] ?? 0) * salad.price
    }, 0)

    return setsTotal + saladsTotal
  }, [draft.coldPlateSelections, draft.coldPlateSaladSelections])

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

  const total = subtotal + serviceFee + coldPlateTotal

  return {
    pricePerPerson,
    packageTotal,
    soupTotal,
    extensionTotal,
    children312Total,
    serviceFee,
    total,
    coldPlateTotal,
  }
}
