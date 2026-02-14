'use client'

import { Card } from '@/app/components/ui/card'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Textarea } from '@/app/components/ui/textarea'
import { ServingStyle, SpecialDiet } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { cn } from '@/lib/utils'

const SERVING_OPTIONS: {
  value: ServingStyle
  title: string
  description: string
  goodIf: string[]
}[] = [
  {
    value: 'plated',
    title: '🍽 Kolacja talerzykowa',
    description:
      'Każdy gość otrzymuje własne dania na talerzu: przystawkę / zupę / danie główne / deser – z wybranego menu.',
    goodIf: [
      'chcesz eleganckie przyjęcie',
      'zależy Ci na spokojnej, uporządkowanej atmosferze',
    ],
  },
  {
    value: 'sharing',
    title: '🥗 Kolacja w formie półmisków',
    description:
      'Dania stoją na środku stołu – goście nakładają sobie sami. Jedna porcja półmisków jest przygotowana dla 6 osób.',
    goodIf: [
      'chcesz luźną, rodzinną atmosferę',
      'goście lubią dzielić się jedzeniem',
    ],
  },
  {
    value: 'combo',
    title: '🔄 Wariant KOMBI – talerze + półmiski',
    description:
      'Przystawka i zupa są podawane indywidualnie na talerzach, natomiast dania główne serwujemy w formie półmisków – do wspólnego dzielenia przy stole.',
    goodIf: [
      'chcesz elegancki początek przyjęcia',
      'a później luźną, rodzinną atmosferę przy daniach głównych',
    ],
  },
]

const DIET_OPTIONS: {
  value: SpecialDiet
  label: string
}[] = [
  { value: 'vegetarian', label: 'Dieta wegetariańska' },
  { value: 'lactose_free', label: 'Dieta bez laktozy' },
  { value: 'gluten_free', label: 'Dieta bez glutenu' },
  { value: 'other', label: 'Inne potrzeby' },
]

const ServingStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const isOtherSelected = draft.specialDiets?.includes('other') ?? false

  const isCommentInvalid =
    isOtherSelected &&
    (!draft.specialDietComment || draft.specialDietComment.trim().length === 0)

  const toggleDiet = (diet: SpecialDiet) => {
    const current = draft.specialDiets ?? []

    if (current.includes(diet)) {
      updateDraft(
        'specialDiets',
        current.filter((d) => d !== diet)
      )
    } else {
      updateDraft('specialDiets', [...current, diet])
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4">
      {/* SECTION 1 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Jak chcesz, aby były podane dania?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVING_OPTIONS.map((option) => {
            const isSelected = draft.servingStyle === option.value

            return (
              <Card
                key={option.value}
                onClick={() => updateDraft('servingStyle', option.value)}
                className={cn(
                  'p-6 cursor-pointer transition border h-full',
                  isSelected
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-muted-foreground/30'
                )}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{option.title}</h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Dobre, jeśli:</p>

                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {option.goodIf.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Specjalne potrzeby żywieniowe
        </h2>

        <div className="space-y-4">
          {DIET_OPTIONS.map((diet) => (
            <label key={diet.value} className="flex items-center gap-3">
              <Checkbox
                checked={draft.specialDiets?.includes(diet.value) ?? false}
                onCheckedChange={() => toggleDiet(diet.value)}
              />
              {diet.label}
            </label>
          ))}
        </div>

        {isOtherSelected && (
          <div className="space-y-2">
            <Textarea
              placeholder="Opisz dodatkowe potrzeby..."
              value={draft.specialDietComment ?? ''}
              onChange={(e) =>
                updateDraft('specialDietComment', e.target.value)
              }
              className={isCommentInvalid ? 'border-danger' : ''}
            />

            {isCommentInvalid && (
              <p className="text-sm text-danger">
                Opisz proszę dodatkowe potrzeby, abyśmy mogli odpowiednio
                przygotować ofertę.
              </p>
            )}
          </div>
        )}

        <div className="pt-8 space-y-4 text-center">
          <p className="text-base font-semibold">
            Informacje o dietach specjalnych omawiamy indywidualnie podczas
            spotkania z menedżerem.
          </p>

          <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Na tej podstawie przygotujemy dla Ciebie szczegółową ofertę wraz z
            wyceną takich dodatkowych usług.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServingStep
