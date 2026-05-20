// NavBar.tsx
'use client'

import { NAVBAR_ITEMS } from '@/config'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavBar = ({
  className = '',
  itemClassName = '',
  isColumn = false,
  toggleMenu,
}: {
  className?: string
  itemClassName?: string
  isColumn?: boolean
  toggleMenu?: () => void
}) => {
  const pathName = usePathname()

  return (
    <nav className={className}>
      <ul
        className={cn('flex', {
          'flex-col gap-1': isColumn,
          'flex-row gap-1 lg:gap-2': !isColumn,
        })}
      >
        {NAVBAR_ITEMS.map((item) => {
          const isActive = pathName === item.link

          return (
            <li key={item.link} onClick={toggleMenu}>
              <Link
                href={item.link}
                className={cn(
                  'relative inline-flex items-center px-2 py-2 transition-colors duration-300',
                  isColumn
                    ? 'w-full rounded-md border-l-2 border-transparent pl-4'
                    : 'after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300',
                  itemClassName,
                  {
                    'text-zinc-950 after:scale-x-100': isActive && !isColumn,
                    'border-primary bg-primary/10 text-zinc-950':
                      isActive && isColumn,
                    'hover:text-primary': true,
                  }
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavBar
