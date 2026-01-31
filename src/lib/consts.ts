//src/lib/consts.ts

import DateGuestsStep from '@/app/components/reservation/steps/DateGuestsStep'
import WelcomeStep from '@/app/components/reservation/steps/WelcomeStep'
import { ReservationDraft } from '@/app/types/reservation'

//RESERVATION
export const STEP_COMPONENTS: Record<string, React.FC> = {
  welcome: WelcomeStep,
  'date-guests': DateGuestsStep,
}

export const RESERVATION_STEPS = [
  {
    key: 'date-guests',
    label: 'Data i liczba gości',
    isValid: (draft: ReservationDraft) =>
      Boolean(draft.eventDate) &&
      typeof draft.adultsCount === 'number' &&
      draft.adultsCount >= 8,
  },
  {
    key: 'package',
    label: 'Pakiet',
    isValid: () => true,
  },
  {
    key: 'addons',
    label: 'Dodatki',
    isValid: () => true,
  },
  {
    key: 'summary',
    label: 'Podsumowanie',
    isValid: () => true,
  },
  {
    key: 'contact',
    label: 'Dane kontaktowe',
    isValid: () => true,
  },
] as const
