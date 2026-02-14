'use client'

import { Button } from '@/app/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { useReservationPricing } from '@/app/utils/hooks/reservation/useReservationPricing'
import { RESERVATION_STEPS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LiaChevronCircleUpSolid } from 'react-icons/lia'
import ReservationSummaryContent from './ReservationSummaryContent'
import StepNavigation from './StepNavigation'

const BottomWizardBar = () => {
  const searchParams = useSearchParams()
  const stepKey = searchParams.get('step')

  const { draft } = useReservationDraft()
  const { total } = useReservationPricing(draft)

  const [open, setOpen] = useState(false)

  if (!stepKey) return null

  const currentIndex = RESERVATION_STEPS.findIndex((s) => s.key === stepKey)
  if (currentIndex === -1) return null

  return (
    <div
      className="
  z-40 border-t bg-background/95 backdrop-blur
  px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]
  md:px-4 md:py-3
"
    >
      <div className="mx-auto flex w-full items-center justify-between gap-2 md:gap-4">
        {/* LEFT – CENA / DROPDOWN */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              size="sm"
              disabled={total === 0}
              className="
    h-10
    w-auto
    max-w-[38vw]
    shrink-0
    rounded-full
    px-3 md:px-5
    gap-1.5 md:gap-3
    text-base md:text-base
    font-medium
    shadow-sm
  "
            >
              <span className="font-semibold">
                <span className="hidden md:inline">Suma orientacyjna: </span>
                {total > 0 ? `${total} zł` : '—'}
              </span>

              <LiaChevronCircleUpSolid
                className={cn(
                  'h-4 w-4 md:h-5 md:w-5 transition-transform duration-300',
                  open && 'rotate-180'
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="
			w-[calc(100vw-2rem)]
			max-w-[380px]
    max-h-[min(70dvh,560px)]
    md:max-h-[min(80dvh,680px)]
    overflow-y-auto
    overscroll-contain
    rounded-2xl
    p-6
    shadow-xl
    border
    bg-background

    origin-bottom-right
    transition-all
    duration-300
    ease-[cubic-bezier(0.16,1,0.3,1)]

    data-[state=open]:opacity-100
    data-[state=open]:translate-y-0
    data-[state=open]:scale-100

    data-[state=closed]:opacity-0
    data-[state=closed]:translate-y-3
    data-[state=closed]:scale-[0.97]
  "
          >
            <ReservationSummaryContent />
          </PopoverContent>
        </Popover>

        {/* RIGHT – NAWIGACJA */}
        <StepNavigation />
      </div>
    </div>
  )
}

export default BottomWizardBar
