'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { SOFT_DRINK_OPTIONS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const SoftDrinksStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const selections = useMemo(() => draft.softDrinkSelections ?? {}, [
    draft.softDrinkSelections,
  ])

  const adults = draft.adultsCount ?? 0
  const recommendedJugs = adults > 0 ? Math.ceil(adults / 6) : 0

  const totalPrice = useMemo(() => {
    return SOFT_DRINK_OPTIONS.reduce((sum, option) => {
      return sum + (selections[option.id] ?? 0) * option.price
    }, 0)
  }, [selections])

  const updateDrink = (id: string, value: number) => {
    updateDraft('softDrinkSelections', {
      ...selections,
      [id]: Math.max(0, value),
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Napoje bezalkoholowe</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Zaplanuj orientacyjną ilość napojów. Jeśli podczas przyjęcia zabraknie
          napojów, uzupełnimy je na bieżąco. Rozliczenie odbywa się według
          faktycznego zużycia.
        </p>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        {SOFT_DRINK_OPTIONS.map((option) => {
          const qty = selections[option.id] ?? 0
          const lineTotal = qty * option.price
          return (
            <div
              key={option.id}
              className={cn(
                'rounded-lg border p-3 space-y-2',
                qty > 0 && 'ring-2 ring-primary'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.description} • {option.volumeLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.price} zł / szt.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border px-2 py-1 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateDrink(option.id, qty - 1)}
                    disabled={qty === 0}
                    className="h-8 w-8"
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
                    onClick={() => updateDrink(option.id, qty + 1)}
                    className="h-8 w-8"
                  >
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {lineTotal > 0 && (
                <p className="text-xs text-muted-foreground">
                  Suma pozycji: {lineTotal} zł
                </p>
              )}

              {option.recommendation && (
                <p className="text-xs text-muted-foreground">{option.recommendation}</p>
              )}
            </div>
          )
        })}
      </Card>

      <div className="text-right space-y-1">
        {recommendedJugs > 0 && (
          <p className="text-xs text-muted-foreground">
            Dla {adults} osób dorosłych rekomendujemy około {recommendedJugs}{' '}
            dzbanek(ów) soków/lemoniady.
          </p>
        )}
        <p className="text-xl font-semibold">Suma napojów: {totalPrice} zł</p>
      </div>
    </div>
  )
}

export default SoftDrinksStep
