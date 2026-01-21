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
import { useEffect, useState } from 'react'
import { RxDoubleArrowDown } from 'react-icons/rx'

interface Banner {
  desktopImageUrl: string
  mobileImageUrl?: string
  createdAt?: string
}

const HeroCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const extractNumber = (url: string) => {
    const match = url.match(/(\d+)(?=\.\w+$)/)
    return match ? parseInt(match[1], 10) : 0
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/main-banners')
        if (!response.ok) throw new Error('Failed to fetch banners')
        const data: Banner[] = await response.json()

        const sortedBanners = data.sort(
          (a, b) =>
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
        )

        if (sortedBanners.length === 0) {
          setBanners(
            CAROUSEL_MAIN_IMAGES.map((img) => ({
              desktopImageUrl: img.src,
              mobileImageUrl: img.srcMobile,
            })).sort(
              (a, b) =>
                extractNumber(b.desktopImageUrl) -
                extractNumber(a.desktopImageUrl)
            )
          )
        } else {
          setBanners(
            [
              ...sortedBanners,
              ...CAROUSEL_MAIN_IMAGES.filter(
                (staticImg) =>
                  !sortedBanners.some(
                    (b) => b.desktopImageUrl === staticImg.src
                  )
              ).map((img) => ({
                desktopImageUrl: img.src,
                mobileImageUrl: img.srcMobile,
              })),
            ].sort(
              (a, b) =>
                extractNumber(b.desktopImageUrl) -
                extractNumber(a.desktopImageUrl)
            )
          )
        }
      } catch {
        setBanners(
          CAROUSEL_MAIN_IMAGES.map((img) => ({
            desktopImageUrl: img.src,
            mobileImageUrl: img.srcMobile,
          })).sort(
            (a, b) =>
              extractNumber(b.desktopImageUrl) -
              extractNumber(a.desktopImageUrl)
          )
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // ------------------------------------------------------
  // SKELETON (full screen) while banners are loading
  // ------------------------------------------------------
  if (isLoading) {
    return (
      <div className="h-screen w-full animate-pulse bg-muted flex items-center justify-center">
        <div className="w-full h-1/2 bg-gray-300/30 rounded-xl" />
      </div>
    )
  }

  // ------------------------------------------------------
  // RENDER CAROUSEL
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
