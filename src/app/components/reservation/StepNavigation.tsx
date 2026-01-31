'use client'

import { Button } from '@/app/components/ui/button'
import { RESERVATION_STEPS } from '@/lib/consts'
import { useRouter, useSearchParams } from 'next/navigation'
import { BiSolidChevronLeft, BiSolidChevronRight } from 'react-icons/bi'

const StepNavigation = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  if (!step || !RESERVATION_STEPS.some((s) => s.key === step)) {
    return null
  }

  const currentIndex = RESERVATION_STEPS.findIndex((s) => s.key === step)
  const totalSteps = RESERVATION_STEPS.length

  const goNext = () => {
    const next = RESERVATION_STEPS[currentIndex + 1]
    if (next) router.push(`/reservation?step=${next.key}`)
  }

  const goBack = () => {
    const prev = RESERVATION_STEPS[currentIndex - 1]
    if (prev) router.push(`/reservation?step=${prev.key}`)
  }

  return (
    <div className="flex items-center gap-3">
      {/* MOBILE */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          onClick={goBack}
          disabled={currentIndex === 0}
          size="icon"
          variant="ghost"
        >
          <BiSolidChevronLeft className="h-5 w-5 text-primary" />
        </Button>

        <span className="text-sm text-muted-foreground font-normal tabular-nums">
          {currentIndex + 1}/{totalSteps}
        </span>

        <Button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
          size="icon"
          variant="ghost"
        >
          <BiSolidChevronRight className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* DESKTOP – BEZ ZMIAN */}
      <div className="hidden md:flex items-center gap-6">
        <Button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          <BiSolidChevronLeft /> Wstecz
        </Button>

        <span className="text-sm text-muted-foreground">
          Krok {currentIndex + 1} z {totalSteps}
        </span>

        <Button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
          className="font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          Dalej <BiSolidChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default StepNavigation
