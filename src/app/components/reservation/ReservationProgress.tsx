'use client'

import { RESERVATION_STEPS } from '@/lib/consts'
import { useSearchParams } from 'next/navigation'
import { Progress } from '../ui/progress'

export default function ReservationProgress() {
  const searchParams = useSearchParams()
  const step = searchParams.get('step') ?? RESERVATION_STEPS[0].key

  const currentIndex = RESERVATION_STEPS.findIndex((s) => s.key === step)

  const progress = ((currentIndex + 1) / RESERVATION_STEPS.length) * 100

  return (
    <div className="space-y-2">
      <div className="sticky flex justify-between text-sm text-muted-foreground">
        <span>
          Krok {currentIndex + 1} z {RESERVATION_STEPS.length}
        </span>
        <span>{RESERVATION_STEPS[currentIndex]?.label}</span>
      </div>

      <Progress value={progress} />
    </div>
  )
}
