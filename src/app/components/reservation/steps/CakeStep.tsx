'use client'

import { Card } from '@/app/components/ui/card'
import type { CakeOption } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { cn } from '@/lib/utils'

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
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-6">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold">
          Tort na Twoje przyjęcie
        </h2>
        <p className="text-xl md:text-3xl font-semibold leading-tight">
          Wiemy, że każdy ma swoją ulubioną cukiernię i swój wymarzony tort.
          <br />
          Dlatego możesz przynieść własny tort na przyjęcie.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-5 md:p-6 space-y-4">
          <h3 className="text-2xl font-semibold">Co musisz wiedzieć?</h3>

          <ul className="space-y-2 text-base md:text-lg">
            <li>• Przy dostarczeniu tortu prosimy o dowód zakupu z datą produkcji.</li>
            <li>• Za serwowanie własnego tortu doliczamy opłatę talerzykową 10 zł / osoba.</li>
            <li>
              • Tort może zostać dostarczony do restauracji nie wcześniej niż na
              1 godzinę przed rozpoczęciem przyjęcia.
            </li>
          </ul>

          <div className="space-y-2 pt-2">
            <p className="text-xl font-semibold">W opłacie zawarte jest:</p>
            <ul className="space-y-1 text-base md:text-lg">
              <li>– patera pod tort,</li>
              <li>– pokrojenie tortu przez obsługę,</li>
              <li>– serwowanie gościom,</li>
              <li>– przechowywanie tortu w lodówce do momentu podania.</li>
            </ul>
          </div>
        </Card>

        <Card className="p-5 md:p-6 h-fit">
          <p className="rounded-xl bg-warning/30 px-4 py-3 text-xl font-semibold leading-snug">
            Dodatki do tortu: świeczki, race, dekoracje itp. prosimy zapewnić
            we własnym zakresie.
          </p>
        </Card>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="text-2xl font-semibold">🎂 Twoja decyzja - wybierz jedną opcję</p>

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
              <p className="text-lg font-medium">{option.label}</p>
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
