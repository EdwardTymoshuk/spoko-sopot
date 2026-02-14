import type { PackageType } from '@/app/types/reservation'
import { PACKAGES } from '@/lib/consts'
import PackageCard from './PackageCard'
import PackageDetails from './PackageDetails'

interface Props {
  selected: PackageType | null
  expanded: PackageType | null
  onSelect: (pkg: PackageType) => void
  onExpand: (pkg: PackageType | null) => void
}

const PackagesGrid = ({ selected, expanded, onSelect, onExpand }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PACKAGES.map((pkg) => {
        const isExpanded = expanded === pkg.type

        return (
          <PackageCard
            key={pkg.type}
            packageType={pkg.type}
            title={pkg.title}
            price={pkg.price}
            badge={pkg.badge}
            summary={pkg.summary}
            selected={selected === pkg.type}
            expanded={isExpanded}
            dimmed={expanded !== null && expanded !== pkg.type}
            onSelect={() => onSelect(pkg.type)}
            onToggleExpand={() => onExpand(isExpanded ? null : pkg.type)}
            mobileDetails={<PackageDetails pkg={pkg} />}
          />
        )
      })}
    </div>
  )
}
export default PackagesGrid
