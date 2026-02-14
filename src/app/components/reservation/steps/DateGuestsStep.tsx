'use client'

import PriceCalendar from '@/app/components/reservation/calendar/PriceCalendar'
import { Card } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'
import type { ChildrenMenuOption } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { cn } from '@/lib/utils'
import { FiMinus, FiPlus } from 'react-icons/fi'

const MOCK_AVAILABILITY = [
  { date: new Date(2026, 0, 10), isBlocked: false, basePriceFrom: 250 },
  { date: new Date(2026, 0, 11), isBlocked: true, basePriceFrom: 250 },
  { date: new Date(2026, 0, 14), isBlocked: false, basePriceFrom: 350 },
  { date: new Date(2026, 0, 15), isBlocked: true, basePriceFrom: null },
]

const KIDS_MENU_ITEMS = [
  'Mini bruschetta z pomidorem i mozzarellą',
  'Panierowane fileciki z kurczaka z frytkami i ketchupem',
  'Panierowane fileciki z dorsza z frytkami i ketchupem',
  'Mini pizza Margherita',
  'Grillowany filet z kurczaka z puree ziemniaczanym, marchewką i groszkiem',
]

type CounterProps = {
  value: number
  min?: number
  onChange: (value: number) => void
  ariaLabel: string
}

const Counter = ({ value, min = 0, onChange, ariaLabel }: CounterProps) => (
  <div className="flex items-center justify-center gap-4">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="h-10 w-10 rounded-md border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Zmniejsz ${ariaLabel}`}
    >
      <FiMinus className="mx-auto h-4 w-4" />
    </button>

    <div className="min-w-12 text-center text-3xl md:text-4xl font-serif tabular-nums">
      {value}
    </div>

    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="h-10 w-10 rounded-md border transition-colors hover:bg-muted"
      aria-label={`Zwiększ ${ariaLabel}`}
    >
      <FiPlus className="mx-auto h-4 w-4" />
    </button>
  </div>
)

type OptionCardProps = {
  selected: boolean
  title: string
  description: string
  hint?: string
  onClick: () => void
}

const OptionCard = ({
  selected,
  title,
  description,
  hint,
  onClick,
}: OptionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full rounded-xl border p-4 text-left transition-all',
      selected
        ? 'border-primary ring-2 ring-primary bg-primary/5'
        : 'border-border hover:border-primary/40'
    )}
  >
    <p className="font-semibold">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    {hint && <p className="mt-2 text-xs text-primary font-medium">{hint}</p>}
  </button>
)

const DateGuestsStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  const adults = draft.adultsCount ?? 10
  const childrenUnder3 = draft.childrenUnder3Count ?? 0
  const children3to12 = draft.children3to12Count ?? 0

  const shouldPickChildrenOption = children3to12 > 0
  const isChildrenOptionMissing =
    shouldPickChildrenOption && !draft.childrenMenuOption

  const updateChildren312 = (value: number) => {
    const next = Math.max(0, value)
    updateDraft('children3to12Count', next)
    if (next === 0) {
      updateDraft('childrenMenuOption', null)
    }
  }

  const selectChildrenOption = (value: ChildrenMenuOption) => {
    updateDraft('childrenMenuOption', value)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 px-3 pt-5 pb-4 md:p-6">
      <div className="space-y-1 px-1">
        <h2 className="text-xl md:text-2xl font-semibold">Data i liczba gości</h2>
        <p className="text-sm text-muted-foreground">
          Wybierz termin i podaj orientacyjną liczbę uczestników.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-4 md:gap-6 items-start">
        <Card className="p-4 md:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-semibold text-secondary">
              Wybierz datę
            </h3>
            <p className="text-sm text-muted-foreground">
              Sprawdź dostępność i cenę orientacyjną w kalendarzu.
            </p>
          </div>

          <PriceCalendar
            value={draft.eventDate ? new Date(draft.eventDate) : undefined}
            availability={MOCK_AVAILABILITY}
            onChange={(date) => updateDraft('eventDate', date ?? null)}
          />

          <p className="text-xs text-muted-foreground">
            Ceny są orientacyjne i dotyczą osoby dorosłej. Ostateczna wycena
            zależy od menu i wybranych dodatków.
          </p>
        </Card>

        <Card className="p-4 md:p-6 space-y-6">
          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-semibold text-secondary">
                Goście dorośli
              </h3>
              <p className="text-sm text-muted-foreground">
                Rezerwacje online realizujemy od 8 osób dorosłych.
              </p>
            </div>

            <Counter
              value={adults}
              min={1}
              onChange={(value) => updateDraft('adultsCount', value)}
              ariaLabel="liczbę dorosłych"
            />

            <div className="space-y-2">
              {adults < 8 ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  Rezerwacje online realizujemy od 8 osób dorosłych. Dla
                  mniejszych grup zapraszamy do kontaktu: 530 659 666.
                </div>
              ) : (
                <div className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">
                  Dla grup od 8 osób doliczamy serwis 10% dla personelu.
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Osoby powyżej 12 roku życia traktujemy jako dorosłych.
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-semibold text-secondary">
                Dzieci
              </h3>
              <p className="text-sm text-muted-foreground">
                0-3 lata: udział bezpłatny. 3-12 lat: wybór jednej z dwóch
                opcji rozliczenia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border p-4 space-y-3">
                <p className="font-medium">Dzieci 0-3 lata</p>
                <Counter
                  value={childrenUnder3}
                  onChange={(value) => updateDraft('childrenUnder3Count', value)}
                  ariaLabel="liczbę dzieci 0-3 lata"
                />
              </div>

              <div className="rounded-xl border p-4 space-y-3">
                <p className="font-medium">Dzieci 3-12 lat</p>
                <Counter
                  value={children3to12}
                  onChange={updateChildren312}
                  ariaLabel="liczbę dzieci 3-12 lat"
                />
              </div>
            </div>

            {shouldPickChildrenOption && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Wybierz opcję dla dzieci 3-12 lat
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <OptionCard
                    selected={draft.childrenMenuOption === 'half_package'}
                    title="Opcja 1: dzieci jedzą jak dorośli"
                    description="Rozliczenie jako 50% ceny wybranego pakietu dla dorosłych."
                    hint="Ta opcja jest doliczana automatycznie do sumy orientacyjnej."
                    onClick={() => selectChildrenOption('half_package')}
                  />

                  <OptionCard
                    selected={draft.childrenMenuOption === 'kids_menu'}
                    title="Opcja 2: specjalne menu dla dzieci"
                    description="Dedykowany zestaw dziecięcy z osobnej karty."
                    hint="Pozycja oznaczona jako wycena indywidualna."
                    onClick={() => selectChildrenOption('kids_menu')}
                  />
                </div>

                {draft.childrenMenuOption === 'kids_menu' && (
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="text-sm font-medium mb-2">
                      Proponowane menu dziecięce:
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {KIDS_MENU_ITEMS.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isChildrenOptionMissing && (
                  <p className="text-sm text-destructive">
                    Wybierz jedną opcję menu dla dzieci 3-12 lat, aby przejść
                    dalej.
                  </p>
                )}
              </div>
            )}
          </section>
        </Card>
      </div>
    </div>
  )
}

export default DateGuestsStep
