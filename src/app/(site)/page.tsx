'use client'

import { Button } from '@/app/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { useMenu } from '@/context/MenuContext'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import HeroCarousel from '../components/HeroCarousel'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import Opinions from '../components/Opinions'
import PageContainer from '../components/PageContainer'
import PageSubHeader from '../components/PageSubHeader'

const Home: React.FC = () => {
  const { menuItems, loading, refetch } = useMenu()
  const [isLoading, setIsLoading] = useState(false)
  const [isOrderingOpen, setIsOrderingOpen] = useState(false)

  const router = useRouter()

  // Smoothly scrolls to the next section
  const scrollToSection = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth',
    })
  }, [])

  // Navigates to the menu page with a transition for smooth user experience
  const navigateToMenu = async () => {
    setIsLoading(true)
    startTransition(() => {
      router.push('/menu')
    })
  }

  // Navigates to the external order page
  const navigateToOrderPage = async () => {
    setIsLoading(true)
    startTransition(() => {
      router.push('https://order.spokosopot.pl')
    })
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch settings from the API with no caching to ensure fresh data
        const response = await fetch('/api/settings', { cache: 'no-store' })
        const data = await response.json()

        // Update state only if the value has changed
        setIsOrderingOpen((prev) => {
          if (prev !== data.isOrderingOpen) {
            refetch() // Trigger refetch only when `isOrderingOpen` changes
          }
          return data.isOrderingOpen
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings() // Fetch settings once when the component mounts
  }, []) // Runs only once on mount

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <MainContainer className="w-full">
      <div className="flex flex-col h-[calc(var(--vh, 1vh) * 100)] w-full">
        {/* Hero section with carousel */}
        <HeroCarousel />

        {/* Mobile order button with tooltip */}
        <div className="p-4 md:hidden">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  onClick={isOrderingOpen ? navigateToOrderPage : () => {}}
                  className={cn('w-full text-lg font-semibold', {
                    'text-text-secondary': isOrderingOpen,
                    'text-gray-400 opacity-60 cursor-not-allowed':
                      !isOrderingOpen,
                  })}
                >
                  {isOrderingOpen ? (
                    'ZAMÓW ONLINE'
                  ) : (
                    <p className="leading-none">
                      <span>ZAMÓW ONLINE</span>
                      <span className="block text-sm">
                        (tymczasowo niedostępne<i className="text-danger">*</i>)
                      </span>
                    </p>
                  )}
                </Button>
              </TooltipTrigger>
              {!isOrderingOpen && (
                <TooltipContent>
                  <p>Usługa zamawiania online jest tymczasowo niedostępna.</p>
                  <p>
                    W celu słożenia zamówienia prosimy o kontakt telefoniczny.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <PageContainer className="md:hidden">
        <span className="font-special text-4xl text-center pt-4">lub</span>
      </PageContainer>

      {/* Visit us section */}
      <div className="w-full md:max-w-screen-2xl md:mx-auto md:px-8 2xl:p-0 flex flex-col md:flex-row-reverse items-stretch">
        <MaxWidthWrapper className="min-h-full flex-grow">
          <div className="flex flex-col justify-between items-center h-full py-6 md:py-12">
            <PageSubHeader title="Odwiedź nas" className="p-0" />
            <PageContainer className="md:text-2xl flex flex-col gap-4">
              <div>
                <p className="flex gap-1 items-center text-secondary">
                  <FaLocationDot className="text-secondary" /> Hestii 3, 81-731
                  Sopot
                </p>
              </div>
              <div className="text-center">
                <p>Pon-pt: 10:00 - 19:00</p>
                <p>Sob-niedz: 8:00 - 19:00</p>
              </div>
            </PageContainer>

            {/* Reservation popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary-foreground text-lg w-full text-text-primary font-semibold md:w-1/2 hidden md:flex"
                >
                  REZERWACJA
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-center">
                  <p className="mt-2">
                    <h3 className="font-bold text-secondary">Zadzwoń</h3>
                    <a
                      href="tel:+48123456789"
                      className="text-text-secondary hover:underline"
                    >
                      +48 123 456 789
                    </a>
                  </p>
                  <p className="mt-1">
                    <h3 className="font-bold text-secondary">Napisz</h3>
                    <a
                      href="mailto:info@spokosopot.pl"
                      className="text-text-secondary hover:underline"
                    >
                      info@spokosopot.pl
                    </a>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </MaxWidthWrapper>

        <div className="w-full py-2 md:px-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.356080609364!2d18.58294595188907!3d54.43213053637157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0b6edee7521f%3A0x324a244fefc976ef!2sRestauracja%20Spoko%20Sopot!5e0!3m2!1suk!2spl!4v1721160082108!5m2!1suk!2spl"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <MaxWidthWrapper>
        <Opinions />

        <PageSubHeader title="Najbliższe wydarzenie" />

        <PageContainer className="pb-12">
          <div className="flex flex-col w-full md:flex-row overflow-hidden rounded-2xl border bg-muted/30">
            {/* LEFT: IMAGE */}
            <div className="md:w-1/3 bg-secondary/5">
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src="/img/news/valentines-day-2026/valentines-main.png"
                  alt="Walentynki w Spoko"
                  className="w-full h-full object-contain select-none"
                />
              </div>
            </div>

            {/* RIGHT: CONTENT */}
            <div className="md:w-2/3 flex flex-col space-y-4 justify-between p-6">
              <div className="space-y-6 max-w-xl">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  Wydarzenie specjalne
                </span>

                <h3 className="text-3xl font-semibold leading-tight">
                  Walentynki w Spoko ;)
                </h3>

                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-zinc-400">📅 14 lutego</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-400">⏰ 17:00 – 19:00</span>
                </p>

                <p className="text-sm md:text-base leading-relaxed text-text-secondary">
                  Zapraszamy na romantyczny wieczór dla dwojga w wyjątkowej
                  oprawie. Autorskie menu, muzyka na żywo oraz atmosfera
                  stworzona z myślą o prawdziwej randce.
                </p>
              </div>

              <div className="">
                <Button
                  size="lg"
                  className="
            w-full md:w-auto 
            bg-primary hover:bg-primary-foreground font-semibold
            px-8
          "
                  onClick={() => router.push('/news')}
                >
                  Zobacz szczegóły wydarzenia <MdOutlineKeyboardArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>

        {/* {(() => {
          if (loading) {
            // Show skeletons while loading
            return (
              <>
                <PageSubHeader title="Nasze specjale" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                  ))}
                </div>
              </>
            )
          }

          const filteredItems = menuItems.filter(
            (menuItem: MenuItemType) => menuItem.isOnMainPage === true
          )

          if (filteredItems.length === 0) {
            return null
          }

          return (
            <>
              <PageSubHeader title="Nasze specjale" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {filteredItems
                  .slice(0, 8)
                  .map((menuItem: MenuItemType, index: number) => (
                    <MenuItem
                      key={menuItem.id}
                      name={menuItem.name}
                      price={menuItem.price}
                      description={menuItem.description}
                      image={menuItem.image}
                    />
                  ))}
              </div>
            </>
          )
        })()}

        <PageContainer className="pt-2 pb-8">
          <LoadingButton isLoading={isLoading} onClick={navigateToMenu}>
            Sprawdź menu <MdOutlineKeyboardArrowRight />
          </LoadingButton>
        </PageContainer> */}
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default Home
