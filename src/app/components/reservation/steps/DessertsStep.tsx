'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { DESSERT_OPTIONS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const DessertsStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const selections = useMemo(() => draft.dessertSelections ?? {}, [
    draft.dessertSelections,
  ])

  const cakePlatters = useMemo(
    () => DESSERT_OPTIONS.filter((o) => o.category === 'cake_platters'),
    []
  )
  const miniDesserts = useMemo(
    () => DESSERT_OPTIONS.filter((o) => o.category === 'mini_desserts'),
    []
  )

  const totalSelected = useMemo(
    () => Object.values(selections).reduce((sum, qty) => sum + qty, 0),
    [selections]
  )

  const totalPrice = useMemo(() => {
    return DESSERT_OPTIONS.reduce((sum, option) => {
      return sum + (selections[option.id] ?? 0) * option.price
    }, 0)
  }, [selections])

  const hasMiniMinError = useMemo(() => {
    return miniDesserts.some((option) => {
      const qty = selections[option.id] ?? 0
      return qty > 0 && option.minQty && qty < option.minQty
    })
  }, [miniDesserts, selections])

  const incrementWithMin = (current: number, minQty?: number) =>
    current === 0 ? (minQty ?? 1) : current + 1
  const decrementWithMin = (current: number, minQty?: number) => {
    const min = minQty ?? 1
    return current <= min ? 0 : current - 1
  }

  const updateDessert = (id: string, value: number) => {
    updateDraft('dessertSelections', {
      ...selections,
      [id]: Math.max(0, value),
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Desery z naszej kuchni
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Jeśli nie planujesz tortu lub chcesz urozmaicić słodki stół, możesz
          dodać nasze desery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-semibold">Patery ciast</h3>
            <p className="text-sm text-muted-foreground">
              Sernik, szarlotka i brownie w formie gotowych pater.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {cakePlatters.map((option) => {
              const qty = selections[option.id] ?? 0
              return (
                <div
                  key={option.id}
                  className={cn(
                    'rounded-lg border p-3 flex items-center justify-between gap-3',
                    qty > 0 && 'ring-2 ring-primary'
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-medium">{option.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.price} zł / {option.unitLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border px-2 py-1 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateDessert(
                          option.id,
                          decrementWithMin(qty, option.minQty)
                        )
                      }
                      disabled={qty === 0}
                      className="h-8 w-8"
                    >
                      <FiMinus className="h-4 w-4" />
                    </Button>
                    <div className="w-8 text-center font-semibold tabular-nums">{qty}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateDessert(
                          option.id,
                          incrementWithMin(qty, option.minQty)
                        )
                      }
                      className="h-8 w-8"
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-semibold">
              Mini desery
            </h3>
            <p className="text-sm text-muted-foreground">
              Idealne na dłuższe przyjęcia. Dla każdego mini deseru obowiązuje
              minimum 20 szt.
            </p>
          </div>
          <div className="space-y-3">
            {miniDesserts.map((option) => {
              const qty = selections[option.id] ?? 0
              const hasMinError = qty > 0 && Boolean(option.minQty && qty < option.minQty)
              return (
                <div
                  key={option.id}
                  className={cn(
                    'rounded-lg border p-3 space-y-2',
                    qty > 0 && 'ring-2 ring-primary',
                    hasMinError && 'border-destructive/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{option.title}</p>
                      <p className="text-xs text-muted-foreground">
                        minimalne zamówienie: {option.minQty} {option.unitLabel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.price} zł / {option.unitLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border px-2 py-1 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateDessert(
                            option.id,
                            decrementWithMin(qty, option.minQty)
                          )
                        }
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
                        onClick={() =>
                          updateDessert(
                            option.id,
                            incrementWithMin(qty, option.minQty)
                          )
                        }
                        className="h-8 w-8"
                      >
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {hasMinError && (
                    <p className="text-xs text-destructive">
                      Dla tej pozycji wymagane minimum to {option.minQty} {option.unitLabel}.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {hasMiniMinError && (
        <p className="text-sm text-destructive text-center">
          Uzupełnij minimum zamówienia dla wybranych mini deserów, aby przejść dalej.
        </p>
      )}

      <div className="text-right space-y-1">
        <p className="text-muted-foreground">Wybrane pozycje deserowe: {totalSelected}</p>
        <p className="text-xl font-semibold">Suma deserów: {totalPrice} zł</p>
      </div>
    </div>
  )
}

export default DessertsStep
