'use client'

import { Separator } from '@/app/components/ui/separator'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { useReservationPricing } from '@/app/utils/hooks/reservation/useReservationPricing'

const ReservationSummaryContent = () => {
  const { draft } = useReservationDraft()
  const { pricePerPerson, serviceFee, total } = useReservationPricing(draft)

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <p className="text-lg font-semibold">Podsumowanie</p>
      </div>

      <Separator />

      {/* DETAILS */}
      <div className="space-y-3 text-sm text-zinc-700">
        <div className="flex justify-between">
          <span>Data</span>
          <span className="font-medium">
            {draft.eventDate
              ? new Date(draft.eventDate).toLocaleDateString('pl-PL')
              : '—'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Liczba gości</span>
          <span className="font-medium">{draft.adultsCount ?? '—'}</span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span>Cena / osoba</span>
          <span className="font-medium">
            {pricePerPerson ? `${pricePerPerson} zł` : '—'}
          </span>
        </div>

        {serviceFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Serwis 10%</span>
            <span className="font-medium">+{serviceFee} zł</span>
          </div>
        )}
      </div>

      <Separator />

      {/* TOTAL */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Suma orientacyjna</span>
        <span className="text-2xl font-semibold text-zinc-900">
          {total > 0 ? `${total} zł` : '—'}
        </span>
      </div>

      {/* FOOTNOTE */}
      <p className="text-xs text-zinc-500 leading-snug">
        Ostateczna wycena zależy od wybranego menu i dodatków.
      </p>
    </div>
  )
}

export default ReservationSummaryContent
