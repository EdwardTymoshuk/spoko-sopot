'use client'

import MainContainer from '@/app/components/MainContainer'
import BottomWizardBar from '@/app/components/reservation/BottomWizardBar'
import ReservationProgress from '@/app/components/reservation/ReservationProgress'
import { ReservationDraftProvider } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { RESERVATION_STEPS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useRef } from 'react'

const ReservationWizardLayoutClient = ({
  children,
}: {
  children: ReactNode
}) => {
  const searchParams = useSearchParams()
  const rawStep = searchParams.get('step')
  const step = rawStep === 'cake' ? 'desserts' : rawStep
  const isWelcomeStep = !step || step === 'welcome'
  const isThankYouStep = step === 'thank-you'
  const viewportRef = useRef<HTMLDivElement>(null)

  const isWizardStep =
    step !== null && RESERVATION_STEPS.some((s) => s.key === step)

  return (
    <ReservationDraftProvider>
      <div className="flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden bg-background md:h-screen md:max-h-screen">
        {isWizardStep && !isThankYouStep && (
          <header className="z-40 shrink-0 border-b bg-secondary">
            <div className="mx-auto px-4 py-4">
              <ReservationProgress />
            </div>
          </header>
        )}

        <div
          ref={viewportRef}
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain',
            isWelcomeStep || isThankYouStep
              ? 'md:overflow-y-hidden'
              : ''
          )}
        >
          <MainContainer
            className={cn(
              '!min-h-0',
              isWelcomeStep || isThankYouStep ? 'md:h-full' : 'h-full'
            )}
          >
            <div
              className={cn(
                'mx-auto w-full md:flex md:justify-center',
                isWelcomeStep || isThankYouStep
                  ? 'md:min-h-full md:items-center'
                  : 'md:items-start'
              )}
            >
              {children}
            </div>
          </MainContainer>
        </div>

        {isWizardStep && !isThankYouStep && (
          <footer className="z-40 shrink-0">
            <BottomWizardBar />
          </footer>
        )}
      </div>
    </ReservationDraftProvider>
  )
}

export default ReservationWizardLayoutClient
