'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { ALCOHOL_OPTIONS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const AlcoholStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const selections = useMemo(() => draft.alcoholSelections ?? {}, [
    draft.alcoholSelections,
  ])

  const totalPrice = useMemo(() => {
    return ALCOHOL_OPTIONS.reduce((sum, option) => {
      return sum + (selections[option.id] ?? 0) * option.price
    }, 0)
  }, [selections])

  const updateAlcohol = (id: string, value: number) => {
    updateDraft('alcoholSelections', {
      ...selections,
      [id]: Math.max(0, value),
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Alkohol na przyjęciu</h2>
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <p className="text-sm md:text-base font-semibold text-destructive">
            Ważne: na przyjęciach okolicznościowych serwujemy alkohol wyłącznie z
            oferty restauracji.
          </p>
          <p className="mt-1 text-sm md:text-base text-destructive">
            Nie ma możliwości wniesienia i spożywania własnego alkoholu na terenie
            lokalu.
          </p>
        </div>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-base font-semibold">Alkohol mocny - butelki 500 ml</p>
        </div>

        {ALCOHOL_OPTIONS.map((option) => {
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
                    {option.volumeLabel} • {option.price} zł / butelka
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border px-2 py-1 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateAlcohol(option.id, qty - 1)}
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
                    onClick={() => updateAlcohol(option.id, qty + 1)}
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
            </div>
          )
        })}
      </Card>

      <Card className="p-4 md:p-5 border-primary/30 bg-primary/5">
        <p className="text-sm md:text-base font-semibold text-primary">
          Pozostałe alkohole mocne można zamówić z naszej regularnej karty.
        </p>
        <p className="mt-1 text-sm md:text-base font-semibold text-primary">
          Dla Gości przyjęcia przygotowaliśmy 20% rabatu na napoje, kawy i
          herbaty.
        </p>
      </Card>

      <div className="text-right">
        <p className="text-xl font-semibold">Suma alkoholi: {totalPrice} zł</p>
      </div>
    </div>
  )
}

export default AlcoholStep
