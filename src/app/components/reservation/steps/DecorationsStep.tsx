'use client'

import { Card } from '@/app/components/ui/card'

const DecorationsStep = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Dekoracja stołu</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          W cenie przyjęcia uwzględniamy dekorację stołu na przyjęcie
          okolicznościowe.
        </p>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="font-medium">W skład dekoracji wchodzi:</p>
        <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
          <li>• granatowy bieżnik,</li>
          <li>• serwetniki,</li>
          <li>• serwetki indywidualne,</li>
          <li>• świeczniki,</li>
          <li>• pełna zastawa.</li>
        </ul>

        <p className="text-sm md:text-base text-muted-foreground">
          Klimat morski pasujący do Restauracji.
        </p>
      </Card>
    </div>
  )
}

export default DecorationsStep
