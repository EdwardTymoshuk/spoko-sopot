'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { RxDoubleArrowDown } from 'react-icons/rx'

/**
 * Interface representing a banner object.
 */
interface Banner {
  desktopImageUrl: string
  mobileImageUrl?: string
  createdAt?: string // Optional for sorting
}

/**
 * Default images that are **always** displayed at the end.
 */
const defaultImages: Banner[] = [
  {
    desktopImageUrl: '/img/carousel-1.jpg',
    mobileImageUrl: '/img/carousel-1-mobile.jpg',
  },
  {
    desktopImageUrl: '/img/carousel-2.jpg',
    mobileImageUrl: '/img/carousel-2.jpg',
  },
]

const HeroCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/main-banners')
        if (!response.ok) throw new Error('Failed to fetch banners')

        const data: Banner[] = await response.json()

        // Sort banners so the newest ones appear **first**
        const sortedBanners = data.sort(
          (a, b) =>
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
        )

        // Combine new banners with default images
        const finalBanners = [...sortedBanners, ...defaultImages]

        console.log('📌 Final banners list:', finalBanners)

        setBanners(finalBanners)
      } catch (error) {
        console.error('❌ Error fetching banners:', error)
        setBanners(defaultImages) // In case of an error, show only defaults
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

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

        {/* Scroll down button */}
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
