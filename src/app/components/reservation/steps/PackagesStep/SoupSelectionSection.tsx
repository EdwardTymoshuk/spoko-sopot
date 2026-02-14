'use client'

import { Label } from '@/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { PackageType, SoupChoice } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { cn } from '@/lib/utils'

interface Props {
  packageType: PackageType
}

const SoupSelectionSection = ({ packageType }: Props) => {
  const { draft, updateDraft } = useReservationDraft()

  const isPlatinum = packageType === 'platinum'
  const soupRequired = !isPlatinum

  const value = draft.wantsSoup === false ? 'none' : draft.soupChoice ?? ''

  return (
    <div className="rounded-2xl border bg-muted/40 p-6 space-y-5">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Zupa (250 ml)</h3>

        {isPlatinum ? (
          <p className="text-sm text-muted-foreground">
            Zupa opcjonalnie{' '}
            <span className="font-medium text-foreground">
              (+12 zł / osoba)
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Wybierz jedną zupę dla wszystkich gości
          </p>
        )}
      </div>

      {/* OPTIONS */}
      <RadioGroup
        value={value}
        onValueChange={(val) => {
          if (val === 'none') {
            updateDraft('wantsSoup', false)
            updateDraft('soupChoice', null)
            return
          }

          updateDraft('wantsSoup', true)
          updateDraft('soupChoice', val as SoupChoice)
        }}
        className="space-y-3"
      >
        <SoupOption
          value="tomato_cream"
          label="Krem z pomidora z bazyliowym pesto"
          checked={value === 'tomato_cream'}
        />

        <SoupOption
          value="chicken_broth"
          label="Rosół z kury z makaronem"
          checked={value === 'chicken_broth'}
        />

        {isPlatinum && (
          <SoupOption
            value="none"
            label="Nie chcę zupy"
            checked={value === 'none'}
            subtle
          />
        )}
      </RadioGroup>

      {/* VALIDATION */}
      {soupRequired && !draft.soupChoice && (
        <p className="text-sm text-destructive">
          Aby przejść dalej, należy wybrać jedną z opcji.
        </p>
      )}
    </div>
  )
}

export default SoupSelectionSection

/* ---------------------------------------------------------------- */

interface OptionProps {
  value: string
  label: string
  checked: boolean
  subtle?: boolean
}

const SoupOption = ({ value, label, checked, subtle }: OptionProps) => {
  return (
    <Label
      htmlFor={value}
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition',
        checked
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/40',
        subtle && !checked && 'opacity-70'
      )}
    >
      <RadioGroupItem value={value} id={value} />
      <span className="text-sm">{label}</span>
    </Label>
  )
}
