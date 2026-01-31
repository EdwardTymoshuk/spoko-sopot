'use client'

import MainContainer from '@/app/components/MainContainer'
import BottomWizardBar from '@/app/components/reservation/BottomWizardBar'
import ReservationProgress from '@/app/components/reservation/ReservationProgress'
import { ReservationDraftProvider } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { RESERVATION_STEPS } from '@/lib/consts'
import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

const ReservationWizardLayout = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const isWizardStep =
    step !== null && RESERVATION_STEPS.some((s) => s.key === step)

  return (
    <ReservationDraftProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* HEADER */}
        {isWizardStep && (
          <header className="shrink-0 sticky top-0 z-40 bg-secondary border-b">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <ReservationProgress />
            </div>
          </header>
        )}

        {/* CONTENT */}
        <div
          className="
    flex-1
    overflow-y-auto
    md:overflow-hidden
  "
        >
          <MainContainer>
            {/* TEN WRAPPER JEST KLUCZEM */}
            <div
              className="
        mx-auto
        w-full
        md:flex
        md:items-center
        md:justify-center
        md:min-h-[calc(100vh-160px)]
      "
            >
              {children}
            </div>
          </MainContainer>
        </div>

        {/* FOOTER */}
        {isWizardStep && (
          <footer className="shrink-0 sticky bottom-0 z-40">
            <BottomWizardBar />
          </footer>
        )}
      </div>
    </ReservationDraftProvider>
  )
}

export default ReservationWizardLayout
