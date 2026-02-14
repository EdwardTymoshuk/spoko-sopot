'use client'

import type { PackageType } from '@/app/types/reservation'
import { useReservationDraft } from '@/app/utils/hooks/reservation/ReservationDraftContext'
import { PACKAGES } from '@/lib/consts'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import PackageDetails from './PackageDetails'
import PackageExtension from './PackageExtension'
import PackagesGrid from './PackagesGrid'
import SoupSelectionSection from './SoupSelectionSection'

const PackageStep = () => {
  const { draft, updateDraft } = useReservationDraft()
  const [expanded, setExpanded] = useState<PackageType | null>(null)

  const expandedPackage = PACKAGES.find((p) => p.type === expanded)

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

      <PackageExtension />
    </div>
  )
}
export default PackageStep
