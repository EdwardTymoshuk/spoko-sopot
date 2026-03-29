'use client'

import { Card } from '@/app/components/ui/card'
import { Check } from 'lucide-react'

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
        <h2 className="text-2xl md:text-3xl font-semibold">Dekoracja stołu</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          W cenie przyjęcia uwzględniamy dekorację stołu na przyjęcie
          okolicznościowe.
        </p>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <div className="bg-primary/5 px-5 py-4 md:px-6">
          <p className="text-sm font-medium text-primary">
            W skład dekoracji wchodzi
          </p>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {includedItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-background px-4 py-3"
              >
                <p className="flex items-center gap-2 text-sm md:text-base">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-6 bg-muted/30 border-dashed">
        <p className="text-sm md:text-base text-muted-foreground">
          Klimat morski pasujący do Restauracji.
        </p>
      </Card>
    </div>
  )
}

export default DecorationsStep
