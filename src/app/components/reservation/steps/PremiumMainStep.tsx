'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import {
  PREMIUM_MAIN_PLATTERS,
  PREMIUM_MAIN_SIDE_OPTIONS,
  getColdPlateEquivalentGuests,
} from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const pluralize = (
  value: number,
  forms: [singular: string, paucal: string, plural: string]
) => {
  const mod10 = value % 10
  const mod100 = value % 100
  if (value === 1) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return forms[1]
  }
  return forms[2]
}

const PremiumMainStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const adults = draft.adultsCount ?? 0
  const children3to12 = draft.children3to12Count ?? 0

  const selections = useMemo(() => draft.premiumMainSelections ?? {}, [
    draft.premiumMainSelections,
  ])
  const equivalentGuests = getColdPlateEquivalentGuests(draft)
  const minPlatters = Math.ceil(equivalentGuests / 6)

  const totalSelected = useMemo(() => {
    return Object.values(selections).reduce((sum, qty) => sum + qty, 0)
  }, [selections])
  const sideSelections = useMemo(() => draft.premiumMainSideSelections ?? {}, [
    draft.premiumMainSideSelections,
  ])

  const totalPrice = useMemo(() => {
    return PREMIUM_MAIN_PLATTERS.reduce((sum, platter) => {
      return sum + (selections[platter.id] ?? 0) * platter.price
    }, 0)
  }, [selections])

  const totalSidesPrice = useMemo(() => {
    return PREMIUM_MAIN_SIDE_OPTIONS.reduce((sum, section) => {
      return (
        sum +
        section.options.reduce((acc, option) => {
          return acc + (sideSelections[option.id] ?? 0) * option.price
        }, 0)
      )
    }, 0)
  }, [sideSelections])

  const incrementWithMin = (current: number) =>
    current === 0 ? minPlatters : current + 1
  const decrementWithMin = (current: number) =>
    current <= minPlatters ? 0 : current - 1

  const updatePlatter = (id: string, value: number) => {
    updateDraft('premiumMainSelections', {
      ...selections,
      [id]: Math.max(0, value),
    })
  }

  const updateSide = (id: string, value: number) => {
    updateDraft('premiumMainSideSelections', {
      ...sideSelections,
      [id]: Math.max(0, value),
    })
  }
  const hasAnySelection = totalSelected > 0
  const isAnyBelowMin = Object.values(selections).some(
    (value) => value > 0 && value < minPlatters
  )
  const platterWord = pluralize(minPlatters, [
    'półmisek',
    'półmiski',
    'półmisków',
  ])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Półmiski Premium
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Dodatkowe półmiski do dań głównych oraz dodatki ciepłe i surówki.
        </p>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Każdy półmisek Premium jest przygotowany orientacyjnie dla 6 osób.
          </p>
          <p className="text-sm font-medium">
            Dla {adults} osób dorosłych i {children3to12} dzieci w wieku 3-12
            lat polecamy minimum {minPlatters} {platterWord}.
          </p>
          <p className="text-xs text-muted-foreground">
            Krok jest opcjonalny. Po wybraniu półmisków, dla każdego wybranego
            rodzaju obowiązuje minimum {minPlatters} {platterWord}. Dodatki
            (ziemniaki, warzywa, surówki) można dobierać dowolnie.
          </p>
          {hasAnySelection && isAnyBelowMin && (
            <p className="text-sm text-destructive">
              Dla tej liczby gości wymagane minimum {minPlatters} {platterWord}
              dla każdego wybranego rodzaju półmiska.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-6">
        <div className="space-y-4">
          {PREMIUM_MAIN_PLATTERS.map((platter) => {
            const qty = selections[platter.id] ?? 0

            return (
              <Card
                key={platter.id}
                className={cn(
                  'p-5 space-y-4 transition-all',
                  qty > 0 && 'ring-2 ring-primary'
                )}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{platter.title}</h3>

                  <ul className="text-sm text-muted-foreground space-y-1">
                    {platter.description.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  {platter.sauces && platter.sauces.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Sosy w zestawie: {platter.sauces.join(', ')}.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      cena za półmisek
                    </p>
                    <p className="font-semibold">{platter.price} zł</p>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updatePlatter(platter.id, decrementWithMin(qty))
                        }
                        disabled={qty === 0}
                      >
                        <FiMinus className="h-4 w-4" />
                      </Button>

                      <div className="w-10 text-center font-semibold tabular-nums">
                        {qty}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updatePlatter(platter.id, incrementWithMin(qty))
                        }
                      >
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {qty > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Minimum dla tej pozycji: {minPlatters} {platterWord}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-5 md:p-6 space-y-6 h-fit">
          <h3 className="text-2xl font-semibold">Dodatki do dań głównych</h3>

          {PREMIUM_MAIN_SIDE_OPTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="text-lg font-medium">{section.title}</p>
              <div className="space-y-2">
                {section.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm text-muted-foreground">
                        {option.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {option.price} zł
                      </span>
                      <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateSide(option.id, (sideSelections[option.id] ?? 0) - 1)
                          }
                          disabled={(sideSelections[option.id] ?? 0) === 0}
                        >
                          <FiMinus className="h-4 w-4" />
                        </Button>

                        <div className="w-8 text-center font-semibold tabular-nums">
                          {sideSelections[option.id] ?? 0}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateSide(option.id, (sideSelections[option.id] ?? 0) + 1)
                          }
                        >
                          <FiPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            Dodatki dobieramy do finalnego układu menu i liczby gości.
          </div>
        </Card>
      </div>

      <div className="text-right space-y-1">
        <p className="text-muted-foreground">Wybrane półmiski: {totalSelected}</p>
        <p className="text-muted-foreground">
          Dodatki do dań głównych: {totalSidesPrice} zł
        </p>
        <p className="text-xl font-semibold">
          Suma półmisków Premium: {totalPrice + totalSidesPrice} zł
        </p>
      </div>
    </div>
  )
}

export default PremiumMainStep
