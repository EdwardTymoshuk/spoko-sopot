'use client'

import { STEP_COMPONENTS } from '@/lib/consts'
import { useSearchParams } from 'next/navigation'

const ReservationWizardClient = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step') ?? 'welcome'

  const StepComponent = STEP_COMPONENTS[step] ?? STEP_COMPONENTS['welcome']

  return <StepComponent />
}

export default ReservationWizardClient
