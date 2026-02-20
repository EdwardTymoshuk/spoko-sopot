'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import {
  COLD_PLATE_SALADS,
  COLD_PLATE_SETS,
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

const ColdPlateStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const adults = draft.adultsCount ?? 0
  const children3to12 = draft.children3to12Count ?? 0
  const equivalentGuests = getColdPlateEquivalentGuests(draft)
  const minSets = Math.ceil(equivalentGuests / 6)

  const selections = useMemo(() => draft.coldPlateSelections ?? {}, [
    draft.coldPlateSelections,
  ])
  const saladSelections = useMemo(() => draft.coldPlateSaladSelections ?? {}, [
    draft.coldPlateSaladSelections,
  ])

  const totalSelected = useMemo(() => {
    return Object.values(selections).reduce((a, b) => a + b, 0)
  }, [selections])
  const totalSelectedSalads = useMemo(() => {
    return Object.values(saladSelections).reduce((a, b) => a + b, 0)
  }, [saladSelections])

  const totalPrice = useMemo(() => {
    const setsTotal = COLD_PLATE_SETS.reduce((sum, set) => {
      return sum + (selections[set.id] ?? 0) * set.price
    }, 0)

    const saladsTotal = COLD_PLATE_SALADS.reduce((sum, salad) => {
      return sum + (saladSelections[salad.id] ?? 0) * salad.price
    }, 0)

    return setsTotal + saladsTotal
  }, [saladSelections, selections])

  const incrementWithMin = (current: number) =>
    current === 0 ? minSets : current + 1
  const decrementWithMin = (current: number) =>
    current <= minSets ? 0 : current - 1

  const updateSet = (id: string, value: number) => {
    updateDraft('coldPlateSelections', {
      ...selections,
      [id]: Math.max(0, value),
    })
  }

  const updateSalad = (id: string, value: number) => {
    updateDraft('coldPlateSaladSelections', {
      ...saladSelections,
      [id]: Math.max(0, value),
    })
  }
  const hasAnySelection = totalSelected + totalSelectedSalads > 0
  const isSetBelowMin = Object.values(selections).some(
    (value) => value > 0 && value < minSets
  )
  const isSaladBelowMin = Object.values(saladSelections).some(
    (value) => value > 0 && value < minSets
  )
  const isMinNotReached = hasAnySelection && (isSetBelowMin || isSaladBelowMin)
  const setWord = pluralize(minSets, ['zestaw', 'zestawy', 'zestawów'])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Zimna płyta</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Dodatkowe przystawki i sałatki do podania na stole.
        </p>

        <div className="space-y-1">
          <p className="text-muted-foreground">
            Każdy zestaw jest przygotowany z myślą o 6 osobach.
          </p>

          <p className="font-medium">
            Dla {adults} osób dorosłych i {children3to12} dzieci w wieku 3-12
            lat polecamy <span className="text-primary">{minSets}</span>{' '}
            {setWord}.
          </p>

          <p className="text-xs text-muted-foreground">
            Krok jest opcjonalny. Po wybraniu pozycji, dla każdej wybranej
            pozycji obowiązuje minimum {minSets} {setWord}.
          </p>

          {draft.childrenMenuOption === 'half_package' &&
            (draft.children3to12Count ?? 0) > 0 && (
              <p className="text-xs text-muted-foreground">
                Dzieci 3-12 lat z opcją „jak dorośli” liczymy jako 50% osoby
                dorosłej.
              </p>
            )}

          {isMinNotReached && (
            <p className="text-sm text-destructive">
              Dla tej liczby gości wymagane minimum {minSets} {setWord} dla
              każdej wybranej pozycji.
            </p>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {COLD_PLATE_SETS.map((set) => {
          const qty = selections[set.id] ?? 0

          return (
            <Card
              key={set.id}
              className={cn(
                'p-6 space-y-4 transition-all',
                qty > 0 && 'ring-2 ring-primary'
              )}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{set.title}</h3>

                <ul className="text-sm text-muted-foreground space-y-1">
                  {set.description.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">
                    cena za zestaw
                  </p>
                  <p className="font-semibold">{set.price} zł</p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateSet(set.id, decrementWithMin(qty))}
                    disabled={qty === 0}
                    aria-label={`Zmniejsz liczbę zestawów ${set.title}`}
                    className="h-8 w-8"
                  >
                    <FiMinus className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <div
                    className="w-10 text-center font-semibold tabular-nums"
                    aria-live="polite"
                  >
                    {qty}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateSet(set.id, incrementWithMin(qty))}
                    aria-label={`Zwiększ liczbę zestawów ${set.title}`}
                    className="h-8 w-8"
                  >
                    <FiPlus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              {qty > 0 && (
                <p className="text-xs text-muted-foreground border-t pt-3">
                  Minimum dla tej pozycji: {minSets} {setWord}
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {/* SALADS */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">🥗 Sałatki</h3>
          <p className="text-sm text-muted-foreground">
            Dodatkowe propozycje sałatek do zamówienia - dobierz ilość do
            liczby gości.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {COLD_PLATE_SALADS.map((salad) => {
            const qty = saladSelections[salad.id] ?? 0

            return (
              <Card
                key={salad.id}
                className={cn('p-5 space-y-4', qty > 0 && 'ring-2 ring-primary')}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{salad.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {salad.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      cena za porcję
                    </p>
                    <p className="font-semibold">{salad.price} zł</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => updateSalad(salad.id, decrementWithMin(qty))}
                      disabled={qty === 0}
                      aria-label={`Zmniejsz liczbę porcji ${salad.title}`}
                      className="h-8 w-8"
                    >
                      <FiMinus className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    <div
                      className="w-10 text-center font-semibold tabular-nums"
                      aria-live="polite"
                    >
                      {qty}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => updateSalad(salad.id, incrementWithMin(qty))}
                      aria-label={`Zwiększ liczbę porcji ${salad.title}`}
                      className="h-8 w-8"
                    >
                      <FiPlus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                {qty > 0 && (
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    Minimum dla tej pozycji: {minSets} {setWord}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="text-right space-y-2">
        <p className="text-muted-foreground">
          Wybrane zestawy: {totalSelected}
        </p>
        <p className="text-xl font-semibold">
          Suma zimnej płyty: {totalPrice} zł
        </p>
      </div>
    </div>
  )
}

export default ColdPlateStep
