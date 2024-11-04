'use client'

import { Button } from '@/app/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Skeleton } from '@/app/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip'
import { MenuItemType, Opinion } from '@/app/types'
import { CAROUSEL_MAIN_IMAGES, OPINIONS, isDeliveryOpen } from '@/config'
import { useMenu } from '@/context/MenuContext'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6"
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { RxDoubleArrowDown } from "react-icons/rx"
import LoadingButton from './components/LoadingButton'
import MainContainer from './components/MainContainer'
import MaxWidthWrapper from './components/MaxWidthWrapper'
import MenuItem from './components/MenuItem'
import OpinionBlock from './components/OpinionBlock'
import PageContainer from './components/PageContainer'
import PageSubHeader from './components/PageSubHeader'

const Home: React.FC = () => {
  const { menuItems, loading, refetch } = useMenu()
  const [isLoading, setIsLoading] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(true)

  const router = useRouter()

  const scrollToSection = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    })
  }, [])

  const navigateToMenu = async () => {
    setIsLoading(true)
    startTransition(() => {
      router.push('/menu')
    })
  }

  // Додано таймаут на випадок, якщо подія onLoad не спрацює
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoading(false)
    }, 3000) // 3 секунди
    return () => clearTimeout(timer)
  }, [])

  return (
    <MainContainer className='w-full'>
      <div className='flex flex-col h-screen w-full'>
        <div className='flex-grow relative overflow-hidden'>
          <div className="relative h-screen w-full">
            {/* Ваш слайдер */}
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {CAROUSEL_MAIN_IMAGES.map((item, index) => (
                  <CarouselItem key={index} className="relative h-full">
                    <div className="relative h-full">
                      <Image
                        src={item.src}
                        alt="Carousel image"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 text-primary opacity-80 hover:opacity-100" />
              <CarouselNext className="right-0 text-primary opacity-80 hover:opacity-100" />
            </Carousel>

            {/* Пульсуюча кнопка зі стрілкою вниз */}
            <button
              onClick={scrollToSection}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary animate-bounce"
              aria-label="Прокрутка вниз"
            >
              <RxDoubleArrowDown size={40} />
            </button>
          </div>

        </div>
        <div className='p-4 md:hidden'>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='lg'
                  className={cn('w-full text-lg font-semibold', {
                    'text-text-secondary': isDeliveryOpen,
                    'text-gray-400 opacity-60 cursor-not-allowed': !isDeliveryOpen,
                  })}
                >
                  {isDeliveryOpen ? (
                    'ZAMÓW ONLINE'
                  ) : (
                    <p className='leading-none'>
                      <span>ZAMÓW ONLINE</span>
                      <span className="block text-sm">(tymczasowo niedostępne<i className='text-red-800'>*</i> )</span>
                    </p>
                  )}
                </Button>
              </TooltipTrigger>
              {!isDeliveryOpen && (
                <TooltipContent>
                  <p>Usługa zamawiania online jest tymczasowo niedostępna.</p>
                  <p>W celu słożenia zamówienia prosimy o kontakt telefoniczny.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <PageContainer className='md:hidden'>
        <span className='font-special text-4xl text-center pt-4'>lub</span>
      </PageContainer>

      {/* VISIT US BLOCK */}
      <div className='w-full flex flex-col md:flex-row-reverse items-stretch'>
        <MaxWidthWrapper className='min-h-full flex-grow'>
          <div className='flex flex-col justify-between items-center h-full py-6 md:py-12'>
            <PageSubHeader title='Odwiedź nas' className='p-0' />
            <PageContainer className='md:text-2xl flex flex-col gap-4'>
              <div>
                <p className='flex gap-1 items-center text-secondary'>
                  <FaLocationDot className='text-secondary' /> Hestii 3, 81-731 Sopot
                </p>
              </div>
              <div>
                <p>Pon-pt: 10:00 - 19:00</p>
                <p>Sob-niedz: 8:00 - 19:00</p>
              </div>
            </PageContainer>

            {/* Popover for reservation */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size='lg'
                  className='bg-secondary hover:bg-secondary-foreground text-lg w-full text-text-primary font-semibold md:w-1/2 hidden md:flex'
                >
                  REZERWACJA
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='text-center'>
                  <p className='mt-2'>
                    <h3 className='font-bold text-secondary'>Zadzwoń</h3>
                    <a href="tel:+48123456789" className="text-text-seconadary hover:underline">+48 123 456 789</a>
                  </p>
                  <p className='mt-1'>
                    <h3 className='font-bold text-secondary'>Napisz</h3>
                    <a href="mailto:kontakt@spokosopot.pl" className="text-text-seconadary  hover:underline">info@spokosopot.pl</a>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </MaxWidthWrapper>
        <div className='w-full py-2 md:px-8'>
          {isMapLoading ? (
            <Skeleton className="w-full h-[450px] rounded-lg flex items-center justify-center">
              <p className='w-full text-center text-text-foreground'>Ładuję mapę...</p>
            </Skeleton>
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.356080609364!2d18.58294595188907!3d54.43213053637157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0b6edee7521f%3A0x324a244fefc976ef!2sRestauracja%20Spoko%20Sopot!5e0!3m2!1suk!2spl!4v1721160082108!5m2!1suk!2spl"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoading(false)}
            ></iframe>
          )}
          <PageContainer className='px-4 py-4 md:hidden'>
            <Popover>
              <PopoverTrigger asChild>
                <Button size='lg' className='bg-secondary hover:bg-secondary-foreground text-lg w-full text-text-primary font-semibold md:w-1/2'>
                  REZERWACJA
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='text-center'>
                  <p className='mt-2'>
                    <h3 className='font-bold text-secondary'>Zadzwoń</h3>
                    <a href="tel:+48123456789" className="text-text-seconadary hover:underline">+48 123 456 789</a>
                  </p>
                  <p className='mt-1'>
                    <h3 className='font-bold text-secondary'>Napisz</h3>
                    <a href="mailto:kontakt@spokosopot.pl" className="text-text-seconadary  hover:underline">info@spokosopot.pl</a>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </PageContainer>
        </div>
      </div>

      <MaxWidthWrapper>

        <PageSubHeader title='Nasi goście o nas' />

        <Carousel
          className='w-full h-full'
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <CarouselContent className='relative h-full m-0'>
            {OPINIONS.map((opinion: Opinion, index: number) => (
              <CarouselItem key={index} className='relative h-full p-0'>
                <OpinionBlock opinion={opinion} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <PageSubHeader title='Nasze specjale' />

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {menuItems.slice(0, 8).map((menuItem: MenuItemType, index: number) => (
              <MenuItem
                key={index}
                name={menuItem.name}
                price={menuItem.price}
                description={menuItem.description}
                image={menuItem.image}
              />
            ))}
          </div>
        )}

        <PageContainer className='pt-2 pb-8'>
          <LoadingButton
            isLoading={isLoading}
            onClick={navigateToMenu}
          >
            Sprawdź menu <MdOutlineKeyboardArrowRight />
          </LoadingButton>
        </PageContainer>

      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default Home
