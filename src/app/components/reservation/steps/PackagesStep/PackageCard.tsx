import type { PackageType } from '@/app/types/reservation'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React from 'react'

interface Props {
  packageType: PackageType
  title: string
  price: number
  badge?: string
  summary: string[]
  selected: boolean
  expanded: boolean
  dimmed: boolean
  onSelect: () => void
  onToggleExpand: () => void
  mobileDetails?: React.ReactNode
}

const PackageCard = ({
  packageType,
  title,
  price,
  badge,
  summary,
  selected,
  expanded,
  dimmed,
  onSelect,
  onToggleExpand,
  mobileDetails,
}: Props) => {
  const isSilver = packageType === 'silver'
  const isGold = packageType === 'gold'
  const isPlatinum = packageType === 'platinum'

  return (
    <motion.div
      initial={false}
      animate={{
        scale: dimmed ? 0.985 : 1,
        opacity: dimmed ? 0.72 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
        layout: { type: 'spring', stiffness: 320, damping: 34 },
      }}
      onClick={onSelect}
      className={cn(
        'relative flex cursor-pointer flex-col gap-6 rounded-2xl border-2 p-6 transition-all',
        'bg-background',
        !selected && 'hover:border-primary-foreground/50',
        selected && 'shadow-sm',
        selected && isSilver && 'border-slate-400 ring-2 ring-slate-300/60',
        selected && isGold && 'border-amber-500 ring-2 ring-amber-300/70',
        selected && isPlatinum && 'border-zinc-500 ring-2 ring-zinc-300/70'
      )}
    >
      {/* BADGE */}
      {(badge || selected) && (
        <span
          className={cn(
            'absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium',
            !selected && 'bg-muted text-muted-foreground',
            selected && isSilver && 'bg-slate-700 text-white',
            selected && isGold && 'bg-amber-500 text-zinc-900',
            selected && isPlatinum && 'bg-zinc-700 text-white'
          )}
        >
          {selected ? 'Wybrano' : badge}
        </span>
      )}

      {/* HEADER */}
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              isSilver && 'bg-slate-400',
              isGold && 'bg-amber-500',
              isPlatinum && 'bg-zinc-500'
            )}
          />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Pakiet przyjęcia okolicznościowego
        </p>
      </div>

      {/* PRICE */}
      <div className="text-3xl font-bold">
        {price} zł
        <span className="text-sm font-normal text-muted-foreground">
          {' '}
          / osoba
        </span>
      </div>

      {/* SUMMARY */}
      <ul className="space-y-1 text-sm">
        {summary.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      {/* DETAILS TOGGLE */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleExpand()
        }}
        className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        {expanded ? 'Ukryj szczegóły' : 'Zobacz szczegóły'}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="inline-flex"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* MOBILE – szczegóły inline */}
      <AnimatePresence initial={false}>
        {expanded && mobileDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden md:hidden"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-6 border-t pt-6"
            >
              {mobileDetails}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PackageCard
