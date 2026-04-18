'use client'

import { RESERVATION_STEPS } from '@/lib/consts'
import { useSearchParams } from 'next/navigation'
import { Progress } from '../ui/progress'

export default function ReservationProgress() {
  const searchParams = useSearchParams()
  const rawStep = searchParams.get('step')
  const step =
    rawStep === 'cake'
      ? 'desserts'
      : rawStep ?? RESERVATION_STEPS[0].key
  const progressSteps = RESERVATION_STEPS.filter((s) => s.key !== 'thank-you')

  const currentIndex = progressSteps.findIndex((s) => s.key === step)
  const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex

  const progress = ((safeCurrentIndex + 1) / progressSteps.length) * 100

  return (
    <div className="space-y-2">
      <div className="sticky flex justify-between text-sm text-muted-foreground">
        <span>
          Krok {safeCurrentIndex + 1} z {progressSteps.length}
        </span>
        <span>{progressSteps[safeCurrentIndex]?.label}</span>
      </div>

      <Progress value={progress} className="h-1" />
    </div>
  )
}
