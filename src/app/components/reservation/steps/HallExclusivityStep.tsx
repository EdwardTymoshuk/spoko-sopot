'use client'

import { Card } from '@/app/components/ui/card'
import type { HallExclusivityOption } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { calculateHallExclusivityCharge, parseTimeToDecimalHour } from '@/lib/consts'
import { cn } from '@/lib/utils'

const OPTIONS: { value: HallExclusivityOption; label: string }[] = [
  { value: 'no', label: 'Nie potrzebuję wyłączności sali' },
  { value: 'yes', label: 'Chcę zamknąć salę na wyłączność' },
]

const HallExclusivityStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const start = parseTimeToDecimalHour(draft.eventStartTime)
  const end = parseTimeToDecimalHour(draft.eventEndTime)
  const isTimeInvalid =
    draft.hallExclusivity === 'yes' &&
    start !== null &&
    end !== null &&
    end <= start

  const { total, billableHours } = calculateHallExclusivityCharge({
    eventDate: draft.eventDate,
    wantsExclusivity: draft.hallExclusivity === 'yes',
    startTime: draft.eventStartTime,
    endTime: draft.eventEndTime,
  })

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Wyłączność sali</h2>
      </div>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="text-lg md:text-xl font-semibold">Jak to działa?</p>
        <p className="text-sm md:text-base text-muted-foreground">
          Przy przyjęciach do 35 osób standardowo nie zamykamy sali na
          wyłączność. W restauracji mogą przebywać również inni goście, a Twoje
          przyjęcie oddzielamy dekoracjami, aby zapewnić większy komfort i
          intymność.
        </p>
        <p className="text-sm md:text-base text-muted-foreground">
          Jeżeli zależy Ci na tym, żeby mieć prywatny event, istnieje możliwość
          wyłączności sali za dodatkową opłatą.
        </p>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="text-base md:text-lg font-semibold">
          Orientacyjne stawki wynajmu sali na wyłączność
        </p>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[540px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Dzień</th>
                <th className="px-4 py-2 text-left font-semibold">Godziny</th>
                <th className="px-4 py-2 text-left font-semibold">Cena / godz.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Pn-Cz</td>
                <td className="px-4 py-2">10:00-13:00</td>
                <td className="px-4 py-2">163 zł</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Pn-Cz</td>
                <td className="px-4 py-2">14:00-19:00</td>
                <td className="px-4 py-2">326 zł</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Pt-Nd</td>
                <td className="px-4 py-2">10:00-13:00</td>
                <td className="px-4 py-2">604 zł</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Pt-Nd</td>
                <td className="px-4 py-2">14:00-19:00</td>
                <td className="px-4 py-2">1 207 zł</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5 md:p-6 space-y-3 border-warning/35 bg-warning/10">
        <p className="text-base md:text-lg font-semibold text-warning">
          Jak liczymy wyłączność sali?
        </p>
        <p className="text-sm md:text-base text-warning">
          Chcemy, aby organizacja przyjęcia była dla Państwa jak najbardziej
          przejrzysta i komfortowa.
        </p>
        <p className="text-sm md:text-base text-warning">
          Restauracja standardowo pracuje do godziny 19:00, dlatego opłatę za
          wyłączność sali naliczamy maksymalnie do tej godziny.
        </p>
        <p className="text-sm md:text-base text-warning">
          Po 19:00 sala pozostaje już naturalnie do dyspozycji gości przyjęcia
          bez dodatkowej opłaty za wyłączność.
        </p>
      </Card>

      <Card className="p-5 md:p-6 space-y-3 border-primary/30 bg-primary/5">
        <p className="text-base md:text-lg font-semibold text-primary">
          Dlaczego wyłączność liczymy tylko do 19:00?
        </p>
        <p className="text-sm md:text-base text-primary/90">
          Restauracja standardowo pracuje do godziny 19:00, dlatego opłatę za
          wyłączność sali naliczamy maksymalnie do tej godziny.
        </p>
        <p className="text-sm md:text-base text-primary/90">
          Standardowy czas trwania przyjęcia to 16:00-21:00.
        </p>
        <p className="text-sm md:text-base text-primary/90">
          Po godzinie 19:00 sala pozostaje już do wyłącznej dyspozycji gości
          przyjęcia bez dodatkowej opłaty za wyłączność - uznajemy, że w tym
          czasie i tak obsługujemy już tylko Państwa wydarzenie.
        </p>
        <p className="text-sm md:text-base font-semibold text-primary">
          Dodatkowe godziny przyjęcia naliczamy dopiero po 21:00.
        </p>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <p className="text-lg md:text-xl font-semibold">Twoja decyzja</p>
        <div className="space-y-3">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateDraft('hallExclusivity', option.value)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all',
                draft.hallExclusivity === option.value
                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              )}
            >
              <p className="font-medium">{option.label}</p>
            </button>
          ))}
        </div>

        {draft.hallExclusivity === 'yes' && (
          <div className="space-y-4 border-t pt-4">
            <div className="rounded-lg border bg-muted/25 p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Godziny przyjęcia</p>
              <p className="font-medium">
                {draft.eventStartTime && draft.eventEndTime
                  ? `${draft.eventStartTime} - ${draft.eventEndTime}`
                  : 'Brak wybranych godzin'}
              </p>
            </div>

            {(!draft.eventStartTime || !draft.eventEndTime || isTimeInvalid) && (
              <p className="text-sm text-destructive">
                Uzupełnij poprawne godziny przyjęcia w kroku „Data i liczba
                gości”.
              </p>
            )}

            {billableHours > 0 && (
              <p className="text-sm font-medium">
                Orientacyjny koszt wyłączności: {total} zł ({billableHours} h
                naliczane do 19:00)
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default HallExclusivityStep
