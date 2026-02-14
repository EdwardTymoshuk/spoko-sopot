'use client'

import MainContainer from '@/app/components/MainContainer'
import BottomWizardBar from '@/app/components/reservation/BottomWizardBar'
import ReservationProgress from '@/app/components/reservation/ReservationProgress'
import { ReservationDraftProvider } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { RESERVATION_STEPS } from '@/lib/consts'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'

const ReservationWizardLayoutClient = ({
  children,
}: {
  children: ReactNode
}) => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')
  const isPackageStep = step === 'package'
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)

  const isWizardStep =
    step !== null && RESERVATION_STEPS.some((s) => s.key === step)

  useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current

    if (!viewport || !content) return

    const updateOverflow = () => {
      setHasOverflow(content.scrollHeight > viewport.clientHeight + 1)
    }

    updateOverflow()

    const observer = new ResizeObserver(updateOverflow)
    observer.observe(viewport)
    observer.observe(content)

    const rafId = requestAnimationFrame(updateOverflow)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [step])

  return (
    <ReservationDraftProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {isWizardStep && (
          <header className="shrink-0 sticky top-0 z-40 bg-secondary border-b">
            <div className="mx-auto px-4 py-4">
              <ReservationProgress />
            </div>
          </header>
        )}

        <div
          ref={viewportRef}
          className="
    flex-1
    min-h-0
    overflow-y-auto
  "
        >
          <MainContainer className="h-full !min-h-0">
            <div
              ref={contentRef}
              className={cn(
                'mx-auto w-full md:flex md:justify-center md:min-h-full',
                hasOverflow || isPackageStep
                  ? 'md:items-start'
                  : 'md:items-center'
              )}
            >
              {children}
            </div>
          </MainContainer>
        </div>

        {isWizardStep && (
          <footer className="shrink-0 sticky bottom-0 z-40">
            <BottomWizardBar />
          </footer>
        )}
      </div>
    </ReservationDraftProvider>
  )
}

export default ReservationWizardLayoutClient
