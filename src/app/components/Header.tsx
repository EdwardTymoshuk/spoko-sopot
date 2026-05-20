// Header.tsx

'use client'

import { Button } from '@/app/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import LoadingButton from './LoadingButton'
import NavBar from './NavBar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOrderingOpen, setIsOrderingOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const navigateToOrderPage = async () => {
    setIsLoading(true)
    startTransition(() => {
      router.push('https://order.spokosopot.pl')
    })
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        setIsOrderingOpen(data.isOrderingOpen)
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-30 min-h-20 border-b border-zinc-200/70 bg-[#f7f3ec]/95 px-4 py-3 text-zinc-900 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex justify-start md:hidden">
          <FaBars
            className="cursor-pointer text-2xl text-zinc-800 transition-all duration-300 hover:text-primary"
            onClick={toggleMenu}
          />
        </div>

        <div className="flex-grow flex justify-center md:justify-start md:flex-1">
          <Link href="/">
            <img
              src="img/logo-spoko-2.png"
              alt="Spoko Restaurant Logo"
              className="max-h-12"
            />
          </Link>
        </div>

        <div className="hidden md:flex md:flex-4">
          <NavBar
            className="flex"
            itemClassName="text-sm lg:text-base font-medium text-zinc-600"
          />
        </div>

        <div className="hidden md:flex md:flex-1 md:gap-2 items-center md:justify-end">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <LoadingButton
                  isLoading={isLoading}
                  variant="default"
                  onClick={isOrderingOpen ? navigateToOrderPage : () => {}}
                  className={cn(
                    'h-11 rounded-lg border border-primary/20 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-950 shadow-none hover:bg-primary/90',
                    {
                      'border-zinc-200 bg-zinc-100 text-zinc-400 opacity-100 hover:bg-zinc-100 cursor-not-allowed':
                        !isOrderingOpen,
                    }
                  )}
                >
                  {isOrderingOpen ? (
                    'ZAMÓW ONLINE'
                  ) : (
                    <p>
                      <span>ZAMÓW ONLINE</span>
                      <span className="block text-xs">
                        (tymczasowo niedostępne<i className="text-red-800">*</i>{' '}
                        )
                      </span>
                    </p>
                  )}
                </LoadingButton>
              </TooltipTrigger>
              {!isOrderingOpen && (
                <TooltipContent>
                  <p>Usługa zamawiania online jest tymczasowo niedostępna. </p>
                  <p>
                    W celu złożenia zamówienia prosimy o kontakt telefoniczny.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden"
            onClick={toggleMenu}
          ></div>
          <div className="fixed inset-0 z-50 flex w-3/4 min-w-[200px] max-w-[400px] translate-x-0 transform flex-col justify-between border-r border-zinc-200/70 bg-[#f7f3ec]/98 p-4 text-zinc-900 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden">
            <div className="flex justify-between items-center">
              <div>
                <FaTimes
                  className="cursor-pointer text-2xl text-zinc-800 transition-all duration-300 hover:text-primary"
                  onClick={toggleMenu}
                />
              </div>
              <div className="flex">
                <Link href="/">
                  <img
                    src="img/logo-spoko-2.png"
                    alt="Spoko Restaurant Logo"
                    className="max-h-12"
                  />
                </Link>
              </div>
            </div>
            <NavBar
              className="mt-8"
              itemClassName="text-xl text-zinc-700"
              isColumn
              toggleMenu={toggleMenu}
            />
            <div className="mt-8 flex flex-col gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={isOrderingOpen ? navigateToOrderPage : () => {}}
                      className={cn(
                        'w-full rounded-lg bg-primary text-center text-sm font-semibold text-zinc-950 hover:bg-primary/90',
                        {
                          'bg-zinc-100 text-zinc-400 opacity-100 hover:bg-zinc-100 cursor-not-allowed':
                            !isOrderingOpen,
                        }
                      )}
                    >
                      {isOrderingOpen ? (
                        'ZAMÓW ONLINE'
                      ) : (
                        <p>
                          <span>ZAMÓW ONLINE</span>
                          <span className="block text-sm">
                            (tymczasowo niedostępne
                            <i className="text-red-800">*</i> )
                          </span>
                        </p>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!isOrderingOpen && (
                    <TooltipContent>
                      <p>
                        Usługa zamawiania online jest tymczasowo niedostępna.{' '}
                      </p>
                      <p>
                        W celu złożenia zamówienia prosimy o kontakt
                        telefoniczny.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                className="w-full rounded-lg border-zinc-200 text-zinc-700 hover:border-primary hover:text-primary"
                onClick={navigateToOrderPage}
              >
                ŚLEDŹ ZAMÓWIENIE
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Header
