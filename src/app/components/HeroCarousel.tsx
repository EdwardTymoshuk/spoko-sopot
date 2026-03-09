'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'
import { CAROUSEL_MAIN_IMAGES } from '@/config'
import Image from 'next/image'
import { useMemo } from 'react'
import { RxDoubleArrowDown } from 'react-icons/rx'

interface Banner {
  desktopImageUrl: string
  mobileImageUrl?: string
}

const HeroCarousel = () => {
  const banners: Banner[] = useMemo(
    () =>
      CAROUSEL_MAIN_IMAGES.map((img) => ({
        desktopImageUrl: img.src,
        mobileImageUrl: img.srcMobile,
      })),
    []
  )

  // ------------------------------------------------------
  // SKELETON (full screen) while banners are loading
  // ------------------------------------------------------
  return (
    <div className="flex-grow relative overflow-hidden">
      <div className="relative h-screen w-full">
        <Carousel className="w-full h-full max-w-full">
          <CarouselContent className="h-full">
            {banners.map((item, index) => (
              <CarouselItem key={index} className="relative h-full">
                <picture className="relative h-full">
                  <source
                    srcSet={item.mobileImageUrl || item.desktopImageUrl}
                    media="(max-width: 768px)"
                  />

                  <Image
                    src={item.desktopImageUrl}
                    alt={`Banner ${index + 1}`}
                    className="min-h-full w-full object-cover"
                    width={1920}
                    height={900}
                    priority
                  />
                </picture>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-0 text-primary opacity-80 hover:opacity-100" />
          <CarouselNext className="right-0 text-primary opacity-80 hover:opacity-100" />
        </Carousel>

        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }
          className="absolute opacity-50 bottom-8 left-1/2 transform -translate-x-1/2 text-primary animate-bounce"
          aria-label="Scroll down"
        >
          <RxDoubleArrowDown size={40} />
        </button>
      </div>
    </div>
  )
}

export default HeroCarousel
