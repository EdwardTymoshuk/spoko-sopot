'use client'

import PriceCalendar from '@/app/components/reservation/calendar/PriceCalendar'
import GuestsCounter from '@/app/components/reservation/guests/GuestsCounter'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { Separator } from '../../ui/separator'

const MOCK_AVAILABILITY = [
  { date: new Date(2026, 0, 10), isBlocked: false, basePriceFrom: 250 },
  { date: new Date(2026, 0, 11), isBlocked: true, basePriceFrom: 250 },
  { date: new Date(2026, 0, 14), isBlocked: false, basePriceFrom: 350 },
  { date: new Date(2026, 0, 15), isBlocked: true, basePriceFrom: null },
]

const DateGuestsStep = () => {
  const { draft, updateDraft } = useReservationDraft()

  return (
    <div className="w-full flex justify-center rounded-2xl md:bg-muted/80 p-2 md:mx-4 md:shadow-sm">
      <div className="w-full max-w-7xl p-4">
        <div
          className="
  flex
  flex-col
  w-full
  gap-10
  justify-self-center
  items-center
  md:items-start
  md:justify-between
  md:flex-row
  md:gap-12
"
        >
          {/* DATE */}
          <section className="space-y-4 w-full md:w-1/2 justify-items-center bg-muted/80 md:bg-transparent rounded-2xl p-2">
            <h2 className="text-2xl font-semibold text-secondary">
              Wybierz datę
            </h2>
            <p className="text-sm text-muted-foreground">
              Sprawdź dostępność i cenę w wybranym terminie
            </p>

            <PriceCalendar
              value={draft.eventDate ? new Date(draft.eventDate) : undefined}
              availability={MOCK_AVAILABILITY}
              onChange={(date) => updateDraft('eventDate', date?.toISOString())}
            />

            <p className="text-xs text-muted-foreground">
              Ceny są orientacyjne i dotyczą osoby dorosłej. Ostateczna wycena
              zależy od menu i wybranych dodatków.
            </p>
          </section>

          {/* mobile */}
          <Separator
            orientation="horizontal"
            className="block md:hidden w-full"
          />

          {/* desktop */}
          <Separator
            orientation="vertical"
            className="hidden md:block h-auto self-stretch"
          />

          {/* GUESTS */}
          <section className="space-y-4 w-full md:w-1/2 justify-items-center bg-muted/80 md:bg-transparent rounded-2xl p-2">
            <h2 className="text-2xl font-semibold text-secondary">
              Liczba gości dorosłych
            </h2>
            <p className="text-sm text-muted-foreground">
              Podaj orientacyjną liczbę osób dorosłych
            </p>

            <GuestsCounter
              value={draft.adultsCount ?? 10}
              onChange={(value) => updateDraft('adultsCount', value)}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default DateGuestsStep
