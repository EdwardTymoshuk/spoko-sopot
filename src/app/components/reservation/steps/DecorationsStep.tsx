'use client'

import { Card } from '@/app/components/ui/card'
import { Check, Sparkles, Waves } from 'lucide-react'

const DecorationsStep = () => {
  const includedItems = [
    'Granatowy bieżnik',
    'Serwetniki',
    'Serwetki indywidualne',
    'Świeczniki',
    'Pełna zastawa',
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Dekoracja stołu na przyjęcie
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          W cenie przyjęcia przygotowujemy bazową dekorację stołu, spójną z
          charakterem Restauracji Spoko.
        </p>
      </div>

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="border-b border-primary/15 px-5 py-4 md:px-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            W cenie przyjęcia otrzymują Państwo
          </p>
        </div>

        <div className="space-y-5 p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {includedItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-background/95 px-4 py-3 shadow-sm"
              >
                <p className="flex items-center gap-2 text-sm md:text-base">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm md:text-base text-zinc-700 leading-relaxed">
              <Waves className="h-4 w-4 text-primary shrink-0" />
              Klimat morski dopasowany do charakteru Restauracji Spoko.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DecorationsStep
