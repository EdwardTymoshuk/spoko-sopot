'use client'

import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { PACKAGES } from '@/lib/consts'
import { AnimatePresence, motion } from 'framer-motion'

const BASE_END_HOUR = 20

const formatHour = (hour: number): string =>
  `${hour.toString().padStart(2, '0')}:00`

const getEndHour = (extraHours: number): string => {
  const hour = (BASE_END_HOUR + extraHours) % 24
  return formatHour(hour)
}

const getLeaveHour = (extraHours: number): string => {
  const hour = (BASE_END_HOUR + extraHours) % 24
  return `${hour.toString().padStart(2, '0')}:15`
}

const PackageExtension = () => {
  const { draft, updateDraft } = useReservationDraft()

  const selectedPackage = PACKAGES.find((p) => p.type === draft.packageType)

  const extensionPrice = selectedPackage?.extensionPricePerHour ?? null

  const hours = draft.extensionHours
  const wants = draft.wantsExtension

  const extensionTotal = wants && extensionPrice ? extensionPrice * hours : 0

  const isDisabled = !selectedPackage

  return (
    <div className="mt-12 space-y-6">
      <p className="text-sm text-muted-foreground max-w-full">
        Cena pakietu obejmuje przyjęcie trwające do{' '}
        <span className="font-medium text-foreground">5 godzin</span>{' '}
        (standardowo 15:00–20:00). Możliwość przedłużenia przyjęcia za dodatkową
        opłatą.
      </p>

      <label
        className={`
          flex items-center gap-4 p-5 rounded-xl border bg-muted/40 
          transition
          ${
            isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:bg-muted'
          }
        `}
      >
        <Checkbox
          disabled={isDisabled}
          checked={wants}
          onCheckedChange={(v) => {
            if (isDisabled) return

            updateDraft('wantsExtension', Boolean(v))
            updateDraft('extensionHours', v ? 1 : 0)
          }}
          className="scale-125"
        />

        <div>
          <p className="font-medium text-base">
            Chcę zapytać o możliwość przedłużenia przyjęcia po 20:00
          </p>

          {extensionPrice && (
            <p className="text-sm text-muted-foreground">
              {extensionPrice} zł / godz.
            </p>
          )}
        </div>
      </label>

      <AnimatePresence initial={false}>
        {wants && extensionPrice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pl-2">
              <p className="text-sm font-medium">
                Wybierz, o ile godzin chcesz przedłużyć przyjęcie
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={hours <= 1}
                  onClick={() => updateDraft('extensionHours', hours - 1)}
                >
                  −
                </Button>

                <div className="min-w-[40px] text-center text-lg font-semibold">
                  {hours}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateDraft('extensionHours', hours + 1)}
                >
                  +
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Przyjęcie zakończy się o{' '}
                <span className="font-medium text-foreground">
                  {getEndHour(hours)}
                </span>
                , a goście powinni opuścić lokal do{' '}
                <span className="font-medium text-foreground">
                  {getLeaveHour(hours)}
                </span>
                .
              </p>

              <p className="text-sm font-medium">
                Koszt przedłużenia: {extensionTotal} zł
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PackageExtension
