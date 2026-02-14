import { Suspense } from 'react'
import ReservationWizardClient from '@/app/components/reservation/ReservationWizardClient'

const ReservationWizardPage = () => {
  return (
    <Suspense fallback={null}>
      <ReservationWizardClient />
    </Suspense>
  )
}

export default ReservationWizardPage
