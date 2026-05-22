// Header.tsx

'use client'

import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { FiPhoneCall } from 'react-icons/fi'
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
    <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-[#ded8cc] bg-[#f4efe6] px-4 text-zinc-900 shadow-sm md:h-18">
      <div className="mx-auto flex h-full items-center justify-between">
        <div className="flex w-10 justify-start md:hidden">
          <FaBars
            className="cursor-pointer text-xl text-zinc-800 transition-all duration-300 hover:text-primary"
            onClick={toggleMenu}
          />
        </div>

        <div className="flex flex-grow justify-end md:justify-start md:flex-1">
          <Link href="/">
            <img
              src="/img/logo-spoko-2.png"
              alt="Spoko Restaurant Logo"
              className="max-h-9 md:max-h-11"
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
          {isLoading ? (
            <LoadingButton
              isLoading={isLoading}
              variant="default"
              className="h-11 rounded-lg border border-primary/20 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-950 shadow-none hover:bg-primary/90"
            />
          ) : isOrderingOpen ? (
            <LoadingButton
              isLoading={false}
              variant="default"
              onClick={navigateToOrderPage}
              className="h-11 rounded-lg border border-primary/20 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-950 shadow-none hover:bg-primary/90"
            >
              ZAMÓW ONLINE
            </LoadingButton>
          ) : (
            <Button
              asChild
              className="h-9 gap-2 rounded-lg border border-secondary/15 bg-white/70 px-4 text-sm font-semibold text-secondary shadow-none hover:border-secondary/30 hover:bg-white"
            >
              <a href="tel:+48530659666">
                <FiPhoneCall className="h-3.5 w-3.5" />
                Kontakt
              </a>
            </Button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden"
            onClick={toggleMenu}
          ></div>
          <div className="fixed inset-0 z-[60] flex h-dvh w-full transform flex-col justify-between bg-[#f7f3ec] p-6 text-zinc-900 transition-all duration-300 ease-in-out md:hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
              <div>
                <FaTimes
                  className="cursor-pointer text-2xl text-zinc-800 transition-all duration-300 hover:text-primary"
                  onClick={toggleMenu}
                />
              </div>
              <div className="flex">
                <Link href="/">
                  <img
                    src="/img/logo-spoko-2.png"
                    alt="Spoko Restaurant Logo"
                    className="max-h-12"
                  />
                </Link>
              </div>
            </div>
            <NavBar
              className="mt-10"
              itemClassName="text-2xl text-zinc-700"
              isColumn
              toggleMenu={toggleMenu}
            />
            <div className="mt-10 flex flex-col gap-3">
              {isLoading ? (
                <LoadingButton
                  isLoading={isLoading}
                  variant="default"
                  className="w-full rounded-lg bg-primary text-center text-sm font-semibold text-zinc-950 hover:bg-primary/90"
                />
              ) : isOrderingOpen ? (
                <Button
                  onClick={navigateToOrderPage}
                  className="w-full rounded-lg bg-primary text-center text-sm font-semibold text-zinc-950 hover:bg-primary/90"
                >
                  ZAMÓW ONLINE
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full gap-2.5 rounded-lg bg-primary text-center text-sm font-semibold text-zinc-950 hover:bg-primary/90"
                >
                  <a href="tel:+48530659666">
                    <FiPhoneCall className="h-4 w-4" />
                    Kontakt telefoniczny
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full rounded-lg border-zinc-300 text-zinc-700 hover:border-primary hover:text-primary"
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
