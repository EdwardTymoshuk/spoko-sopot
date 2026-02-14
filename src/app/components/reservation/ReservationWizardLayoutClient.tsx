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
  const step = searchParams.get('step')
  const isWelcomeStep = !step || step === 'welcome'
  const viewportRef = useRef<HTMLDivElement>(null)

  const isWizardStep =
    step !== null && RESERVATION_STEPS.some((s) => s.key === step)

  return (
    <ReservationDraftProvider>
      <div className="h-[100svh] min-h-[100svh] md:h-screen flex flex-col bg-background overflow-hidden">
        {isWizardStep && (
          <header className="shrink-0 sticky top-0 z-40 bg-secondary border-b">
            <div className="mx-auto px-4 py-4">
              <ReservationProgress />
            </div>
          </header>
        )}

        <div
          ref={viewportRef}
          className={cn(
            `
    flex-1
    min-h-0
    overflow-y-auto
    overscroll-contain
  `,
            isWelcomeStep ? 'overflow-y-hidden' : 'pb-[6.25rem] md:pb-0'
          )}
        >
          <MainContainer className="h-full !min-h-0">
            <div
              className={cn(
                'mx-auto w-full md:flex md:justify-center',
                isWelcomeStep
                  ? 'md:min-h-full md:items-center'
                  : 'md:items-start'
              )}
            >
              {children}
            </div>
          </MainContainer>
        </div>

        {isWizardStep && (
          <footer className="fixed inset-x-0 bottom-0 z-40 md:static md:inset-auto">
            <BottomWizardBar />
          </footer>
        )}
      </div>
    </ReservationDraftProvider>
  )
}

export default ReservationWizardLayoutClient
