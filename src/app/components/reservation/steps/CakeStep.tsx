'use client'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/components/ui/alert'
import { Card } from '@/app/components/ui/card'
import type { CakeOption } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { cn } from '@/lib/utils'
import { FiInfo } from 'react-icons/fi'

const CAKE_OPTIONS: { value: CakeOption; label: string; hint?: string }[] = [
  {
    value: 'own_cake',
    label: 'Przyniosę własny tort',
  },
  {
    value: 'need_bakery_contact',
    label: 'Poproszę o kontakt do cukierni, z którą współpracuje restauracja',
    hint: 'Na hasło „SPOKO” otrzymasz -5% zniżki na tort.',
  },
  {
    value: 'skip',
    label: 'Pomijam ten etap',
  },
]

const CakeStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Tort na przyjęcie</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Możesz przynieść własny tort lub poprosić nas o kontakt do współpracującej
          cukierni.
        </p>
      </div>

      <Alert className="border-primary/25 bg-primary/5">
        <FiInfo className="h-4 w-4 text-primary" />
        <AlertTitle>Desery od Spoko</AlertTitle>
        <AlertDescription>
          Oprócz tortu możemy przygotować autorskie desery. Wybór dodasz w
          następnym kroku.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-5 md:p-6 space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Informacje organizacyjne</h3>

          <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
            <li>• Przy dostarczeniu tortu prosimy o dowód zakupu z datą produkcji.</li>
            <li>• Za serwowanie własnego tortu doliczamy opłatę talerzykową 10 zł / osoba.</li>
            <li>
              • Tortu nie przechowujemy - prosimy dostarczyć go najlepiej na
              planowaną godzinę rozpoczęcia przyjęcia.
            </li>
          </ul>

          <div className="space-y-2 pt-2">
            <p className="text-base md:text-lg font-semibold">W opłacie zawarte jest:</p>
            <ul className="space-y-1 text-sm md:text-base text-muted-foreground">
              <li>– patera pod tort,</li>
              <li>– pokrojenie tortu przez obsługę,</li>
              <li>– serwowanie gościom,</li>
            </ul>
          </div>
        </Card>

        <Card className="p-5 md:p-6 h-fit">
          <Alert className="border-warning/35 bg-warning/10">
            <FiInfo className="h-4 w-4 text-warning" />
            <AlertTitle className="text-base">Dodatki do tortu</AlertTitle>
            <AlertDescription className="text-sm">
              Świeczki, race, dekoracje i inne akcesoria prosimy zapewnić we
              własnym zakresie.
            </AlertDescription>
          </Alert>
        </Card>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="text-lg md:text-xl font-semibold">Wybierz jedną opcję</p>

        <div className="space-y-3">
          {CAKE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateDraft('cakeOption', option.value)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all',
                draft.cakeOption === option.value
                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              )}
            >
              <p className="text-base font-medium">{option.label}</p>
              {option.hint && (
                <p className="mt-1 text-sm text-muted-foreground">{option.hint}</p>
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default CakeStep
