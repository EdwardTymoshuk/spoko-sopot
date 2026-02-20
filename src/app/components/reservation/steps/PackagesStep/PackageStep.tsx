'use client'

import { Checkbox } from '@/app/components/ui/checkbox'
import { Textarea } from '@/app/components/ui/textarea'
import type { PackageType, SpecialDiet } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { PACKAGES } from '@/lib/consts'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import PackageDetails from './PackageDetails'
import PackageExtension from './PackageExtension'
import PackagesGrid from './PackagesGrid'
import SoupSelectionSection from './SoupSelectionSection'

const DIET_OPTIONS: { value: SpecialDiet; label: string }[] = [
  { value: 'vegetarian', label: 'Dieta wegetariańska' },
  { value: 'lactose_free', label: 'Dieta bez laktozy' },
  { value: 'gluten_free', label: 'Dieta bez glutenu' },
  { value: 'other', label: 'Inne potrzeby' },
]

const PackageStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const [expanded, setExpanded] = useState<PackageType | null>(null)

  const expandedPackage = PACKAGES.find((p) => p.type === expanded)
  const isOtherSelected = draft.specialDiets?.includes('other') ?? false
  const isCommentInvalid =
    isOtherSelected &&
    (!draft.specialDietComment || draft.specialDietComment.trim().length === 0)

  const toggleDiet = (diet: SpecialDiet) => {
    const current = draft.specialDiets ?? []

    if (current.includes(diet)) {
      const next = current.filter((d) => d !== diet)
      updateDraft('specialDiets', next)

      if (diet === 'other') {
        updateDraft('specialDietComment', '')
      }
      return
    }

    updateDraft('specialDiets', [...current, diet])
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 [overflow-anchor:none]">
      <PackagesGrid
        selected={draft.packageType ?? null}
        expanded={expanded}
        onSelect={(pkg) => {
          updateDraft('packageType', pkg)

          updateDraft('soupChoice', null)
          updateDraft('wantsSoup', false)

          setExpanded((current) => (current ? pkg : null))
        }}
        onExpand={setExpanded}
      />

      <AnimatePresence initial={false}>
        {expandedPackage && (
          <motion.div
            key={expandedPackage.type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="hidden md:block"
          >
            <PackageDetails key={expandedPackage.type} pkg={expandedPackage} />
          </motion.div>
        )}
      </AnimatePresence>

      {draft.packageType && <SoupSelectionSection packageType={draft.packageType} />}

      <section className="rounded-2xl border bg-card p-5 md:p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-semibold text-secondary">
            Specjalne potrzeby żywieniowe
          </h3>
          <p className="text-sm text-muted-foreground">
            Zaznacz potrzeby gości. Szczegóły dopracujemy przed przyjęciem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIET_OPTIONS.map((diet) => (
            <label
              key={diet.value}
              className="flex items-center gap-3 rounded-lg border p-3 text-sm"
            >
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
              onChange={(e) => updateDraft('specialDietComment', e.target.value)}
              className={isCommentInvalid ? 'border-destructive' : ''}
            />
            {isCommentInvalid && (
              <p className="text-sm text-destructive">
                Uzupełnij opis dodatkowych potrzeb, aby przejść dalej.
              </p>
            )}
          </div>
        )}
      </section>

      <PackageExtension />
    </div>
  )
}
export default PackageStep
