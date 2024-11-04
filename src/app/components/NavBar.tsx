// NavBar.tsx
'use client'

import { NAVBAR_ITEMS } from '@/config'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavBar = ({ className = '', itemClassName = '', isColumn = false, toggleMenu }: { className?: string, itemClassName?: string, isColumn?: boolean, toggleMenu?: () => void }) => {
	const pathName = usePathname()

	return (
		<nav className={className}>
			<ul className={cn('flex', { 'flex-col space-y-2': isColumn, 'flex-row gap-2 lg:gap-4': !isColumn })}>
				{NAVBAR_ITEMS.map((item, index) => (
					<li key={index} onClick={toggleMenu}>
						<Link href={item.link} className={cn(itemClassName, {
							'text-primary': pathName === item.link,
							'hover:text-primary transition-colors duration-300': true,
						})}>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default NavBar
