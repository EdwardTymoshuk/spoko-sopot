'use client'

import { MenuItem as MenuItemType, Opinion } from '@/app/types'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { CAROUSEL_MAIN_IMAGES, MENU_ITEMS, OPINIONS } from '@/config'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { FaLocationDot } from "react-icons/fa6"
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import MainContainer from './components/MainContainer'
import MaxWidthWrapper from './components/MaxWidthWrapper'
import MenuItem from './components/MenuItem'
import OpinionBlock from './components/OpinionBlock'
import PageContainer from './components/PageContainer'
import PageSubHeader from './components/PageSubHeader'

const Home: React.FC = () => {
  return (
    <MainContainer className='w-full'>
      <div className='flex flex-col h-screen w-full'>
        <div className='flex-grow relative overflow-hidden'>
          <Carousel
            className='w-full h-full'
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
          >
            <CarouselContent className='h-full'>
              {CAROUSEL_MAIN_IMAGES.map((item, index) => (
                <CarouselItem key={index} className='relative h-full'>
                  <div className='relative h-full'>
                    <Image
                      src={item.src}
                      alt='Carousel image'
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-0 text-primary opacity-80 hover:opacity-100' />
            <CarouselNext className='right-0 text-primary opacity-80 hover:opacity-100' />
          </Carousel>
        </div>
        <div className='p-4 md:hidden'>
          <Button size='lg' className='w-full text-text-secondary text-lg font-semibold'>ZAMÓW ONLINE</Button>
        </div>
      </div>
      <div className='w-full mx-auto'>
        <PageContainer>
          <span className='font-special text-2xl text-center'>lub</span>
        </PageContainer>
        <PageSubHeader title='Odwiedź nas' />
        <PageContainer>
          <p className='flex gap-1 items-center text-secondary'><FaLocationDot className='text-secondary' /> Hestii 3, 81-731 Sopot</p>
          <p>Pon-pt: 10:00 - 19:00</p>
          <p>Sob-niedz: 8:00 - 19:00</p>
        </PageContainer>
        <div className='w-full py-2'>
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

        <PageContainer className='px-4 pt-2 pb-2'>
          <Button size='lg' className='bg-secondary hover:bg-secondary-foreground text-lg w-full text-text-primary font-semibold'>REZERWACJA</Button>
        </PageContainer>
        <PageSubHeader title='Nasi goście o nas' />
        <MaxWidthWrapper>
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
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {MENU_ITEMS.map((menuItem: MenuItemType, index: number) => (
              <MenuItem
                key={index}
                name={menuItem.name}
                price={menuItem.price}
                description={menuItem.description}
                image={menuItem.image}
              />
            ))}
          </div>
          <div className='py-2 flex justify-center'>
            <Link href='/menu' className='flex flex-row gap-1 w-fit items-center hover:text-secondary transition-all'>
              Zobacz całe menu
              <MdOutlineKeyboardArrowRight />
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
    </MainContainer>
  )
}

export default Home