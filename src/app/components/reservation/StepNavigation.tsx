'use client'

import { Button } from '@/app/components/ui/button'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { RESERVATION_STEPS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { BiSolidChevronLeft, BiSolidChevronRight } from 'react-icons/bi'

const StepNavigation = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { draft } = useReservationDraft()

  const step = searchParams.get('step')

  if (!step || !RESERVATION_STEPS.some((s) => s.key === step)) {
    return null
  }

  const currentIndex = RESERVATION_STEPS.findIndex((s) => s.key === step)

  const totalSteps = RESERVATION_STEPS.length
  const currentStep = RESERVATION_STEPS[currentIndex]

  const isValid = currentStep.isValid(draft)

  const goNext = () => {
    if (!isValid) return

    const next = RESERVATION_STEPS[currentIndex + 1]
    if (next) router.push(`/reservation?step=${next.key}`)
  }

  const goBack = () => {
    const prev = RESERVATION_STEPS[currentIndex - 1]
    if (prev) router.push(`/reservation?step=${prev.key}`)
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 md:w-auto">
      {/* MOBILE */}
      <div className="flex w-full items-center justify-end gap-2 md:hidden">
        <Button
          onClick={goBack}
          disabled={currentIndex === 0}
          variant="outline"
          className="h-10 px-3 justify-center gap-1 font-medium text-sm"
        >
          <BiSolidChevronLeft className="h-4 w-4" />
          Wstecz
        </Button>

        <span className="min-w-10 text-center text-sm text-muted-foreground font-normal tabular-nums">
          {currentIndex + 1}/{totalSteps}
        </span>

        <Button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1 || !isValid}
          className="h-10 px-3 justify-center gap-1 font-medium text-sm"
        >
          Dalej
          <BiSolidChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* DESKTOP */}
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
          disabled={currentIndex === totalSteps - 1 || !isValid}
          className="font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          Dalej <BiSolidChevronRight />
        </Button>
      </div>

      <p
        className={cn(
          'hidden md:block w-full text-xs text-danger text-center min-h-4 transition-opacity',
          isValid ? 'opacity-0' : 'opacity-100'
        )}
      >
        Uzupełnij wymagane pola, aby przejść dalej.
      </p>
    </div>
  )
}

export default StepNavigation
