'use client'

import { Separator } from '@/app/components/ui/separator'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { useReservationPricing } from '@/app/utils/hooks/reservation/useReservationPricing'
import {
  COLD_PLATE_SALADS,
  COLD_PLATE_SETS,
  DESSERT_OPTIONS,
  PACKAGES,
  PREMIUM_MAIN_PLATTERS,
  PREMIUM_MAIN_SIDE_OPTIONS,
} from '@/lib/consts'

const ReservationSummaryContent = () => {
  const { draft } = useReservationDraft()
  const specialDietLabels: Record<string, string> = {
    vegetarian: 'wegetariańska',
    lactose_free: 'bez laktozy',
    gluten_free: 'bez glutenu',
    other: 'inne potrzeby',
  }
  const childrenMenuLabel =
    draft.childrenMenuOption === 'half_package'
      ? 'jak dorośli (50% pakietu)'
      : draft.childrenMenuOption === 'kids_menu'
      ? 'menu dziecięce'
      : null
  const cakeOptionLabel =
    draft.cakeOption === 'own_cake'
      ? 'Przynoszę własny tort'
      : draft.cakeOption === 'need_bakery_contact'
      ? 'Proszę o kontakt do cukierni (-5% na hasło SPOKO)'
      : draft.cakeOption === 'skip'
      ? 'Pomijam etap tortu'
      : null

  const {
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
  } = useReservationPricing(draft)

  const selectedPackage = PACKAGES.find((p) => p.type === draft.packageType)
  const selectedColdPlateSets = COLD_PLATE_SETS.filter(
    (set) => (draft.coldPlateSelections?.[set.id] ?? 0) > 0
  )
  const selectedColdPlateSalads = COLD_PLATE_SALADS.filter(
    (salad) => (draft.coldPlateSaladSelections?.[salad.id] ?? 0) > 0
  )
  const selectedPremiumMainPlatters = PREMIUM_MAIN_PLATTERS.filter(
    (platter) => (draft.premiumMainSelections?.[platter.id] ?? 0) > 0
  )
  const selectedPremiumMainSides = PREMIUM_MAIN_SIDE_OPTIONS.flatMap((section) =>
    section.options.filter((option) => (draft.premiumMainSideSelections?.[option.id] ?? 0) > 0)
  )
  const selectedDesserts = DESSERT_OPTIONS.filter(
    (option) => (draft.dessertSelections?.[option.id] ?? 0) > 0
  )

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-lg font-semibold">Podsumowanie</p>
      </div>

      <Separator />

      <div className="space-y-3 text-sm text-zinc-700">
        {/* DATA */}
        <div className="flex justify-between">
          <span>Data</span>
          <span className="font-medium">
            {draft.eventDate
              ? new Date(draft.eventDate).toLocaleDateString('pl-PL')
              : '—'}
          </span>
        </div>

        {/* GOŚCIE */}
        <div className="flex justify-between">
          <span>Liczba gości</span>
          <span className="font-medium">{draft.adultsCount ?? '—'} dorosłych</span>
        </div>
        <div className="flex justify-between">
          <span>Dzieci 0-3</span>
          <span className="font-medium">{draft.childrenUnder3Count ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Dzieci 3-12</span>
          <span className="font-medium">{draft.children3to12Count ?? 0}</span>
        </div>
        {childrenMenuLabel && (
          <div className="flex justify-between">
            <span>Opcja menu dzieci 3-12</span>
            <span className="font-medium">{childrenMenuLabel}</span>
          </div>
        )}
        {cakeOptionLabel && (
          <div className="flex justify-between">
            <span>Tort</span>
            <span className="font-medium">{cakeOptionLabel}</span>
          </div>
        )}
        {(draft.specialDiets?.length ?? 0) > 0 && (
          <div className="flex justify-between items-start gap-3">
            <span>Potrzeby żywieniowe</span>
            <span className="font-medium text-right">
              {draft.specialDiets
                ?.map((diet) => specialDietLabels[diet] ?? diet)
                .join(', ')}
            </span>
          </div>
        )}
        {draft.specialDiets?.includes('other') &&
          draft.specialDietComment?.trim() && (
            <div className="flex justify-between items-start gap-3 text-xs text-muted-foreground">
              <span>Szczegóły</span>
              <span className="text-right">{draft.specialDietComment.trim()}</span>
            </div>
          )}

        <Separator />

        {/* PAKIET */}
        {selectedPackage && (
          <div className="flex justify-between">
            <span>
              Pakiet {selectedPackage.title} ({pricePerPerson} zł / os.)
            </span>
            <span className="font-medium">{packageTotal} zł</span>
          </div>
        )}

        {children312Total > 0 && (
          <div className="flex justify-between">
            <span>Dzieci 3-12 (50% pakietu)</span>
            <span className="font-medium">+{children312Total} zł</span>
          </div>
        )}

        {(draft.children3to12Count ?? 0) > 0 &&
          draft.childrenMenuOption === 'kids_menu' && (
            <div className="flex justify-between">
              <span>Menu dziecięce 3-12</span>
              <span className="font-medium">wycena indywidualna</span>
            </div>
          )}

        {/* ZUPA */}
        {soupTotal > 0 && (
          <div className="flex justify-between">
            <span>Zupa</span>
            <span className="font-medium">+{soupTotal} zł</span>
          </div>
        )}

        {/* ZIMNA PŁYTA */}
        {coldPlateTotal > 0 && (
          <>
            <div className="flex justify-between">
              <span>Zimna płyta + sałatki</span>
              <span className="font-medium">+{coldPlateTotal} zł</span>
            </div>

            {selectedColdPlateSets.map((set) => (
              <div
                key={set.id}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{set.title}</span>
                <span>x{draft.coldPlateSelections?.[set.id] ?? 0}</span>
              </div>
            ))}

            {selectedColdPlateSalads.map((salad) => (
              <div
                key={salad.id}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{salad.title}</span>
                <span>x{draft.coldPlateSaladSelections?.[salad.id] ?? 0}</span>
              </div>
            ))}
          </>
        )}

        {/* PÓŁMISKI PREMIUM */}
        {(premiumMainTotal > 0 || premiumMainSidesTotal > 0) && (
          <>
            <div className="flex justify-between">
              <span>Półmiski Premium</span>
              <span className="font-medium">
                +{premiumMainTotal + premiumMainSidesTotal} zł
              </span>
            </div>

            {selectedPremiumMainPlatters.map((platter) => (
              <div
                key={platter.id}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{platter.title}</span>
                <span>x{draft.premiumMainSelections?.[platter.id] ?? 0}</span>
              </div>
            ))}

            {selectedPremiumMainSides.map((option) => (
              <div
                key={option.id}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{option.label}</span>
                <span>
                  x{draft.premiumMainSideSelections?.[option.id] ?? 0} (+{(draft.premiumMainSideSelections?.[option.id] ?? 0) * option.price} zł)
                </span>
              </div>
            ))}
          </>
        )}

        {/* DESERY */}
        {dessertsTotal > 0 && (
          <>
            <div className="flex justify-between">
              <span>Desery</span>
              <span className="font-medium">+{dessertsTotal} zł</span>
            </div>

            {selectedDesserts.map((option) => (
              <div
                key={option.id}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{option.title}</span>
                <span>x{draft.dessertSelections?.[option.id] ?? 0}</span>
              </div>
            ))}
          </>
        )}

        {/* PRZEDŁUŻENIE */}
        {extensionTotal > 0 && (
          <div className="flex justify-between">
            <span>Przedłużenie sali</span>
            <span className="font-medium">+{extensionTotal} zł</span>
          </div>
        )}

        {/* SERWIS */}
        {serviceFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Serwis 10%</span>
            <span className="font-medium">+{serviceFee} zł</span>
          </div>
        )}

        {cakeServiceTotal > 0 && (
          <div className="flex justify-between">
            <span>Opłata talerzykowa za tort</span>
            <span className="font-medium">+{cakeServiceTotal} zł</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Suma orientacyjna</span>
        <span className="text-2xl font-semibold text-zinc-900">
          {total > 0 ? `${total} zł` : '—'}
        </span>
      </div>

      <p className="text-xs text-zinc-500 leading-snug">
        Ostateczna wycena zależy od wybranego menu i dodatków.
      </p>
    </div>
  )
}

export default ReservationSummaryContent
