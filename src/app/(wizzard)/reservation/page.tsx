//src/app/(wizard)/reservation/page.tsx

'use client'

import { STEP_COMPONENTS } from '@/lib/consts'
import { useSearchParams } from 'next/navigation'

const ReservationWizardPage = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step') ?? 'welcome'

  const StepComponent = STEP_COMPONENTS[step] ?? STEP_COMPONENTS['welcome']

  return <StepComponent />
}

export default ReservationWizardPage
