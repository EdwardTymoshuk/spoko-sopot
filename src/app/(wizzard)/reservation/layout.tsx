import ReservationWizardLayoutClient from '@/app/components/reservation/ReservationWizardLayoutClient'
import { ReactNode, Suspense } from 'react'

const ReservationWizardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <ReservationWizardLayoutClient>{children}</ReservationWizardLayoutClient>
    </Suspense>
  )
}

export default ReservationWizardLayout
