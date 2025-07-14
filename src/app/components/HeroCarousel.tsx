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

/**
 * Interface representing a banner object fetched from API or fallback.
 */
interface Banner {
  desktopImageUrl: string
  mobileImageUrl?: string
  createdAt?: string // Optional: for sorting
}

/**
 * HeroCarousel component
 * -----------------------------------------
 * Displays a carousel of main banners.
 * - Banners are loaded from an API endpoint (/api/main-banners).
 * - If API returns no banners or fails, fallback images from CAROUSEL_MAIN_IMAGES are shown.
 * - Default images are always included at the end (without duplicates).
 */
const HeroCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    /**
     * Loads banners from API and merges them with fallback images.
     */
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/main-banners')
        if (!response.ok) throw new Error('Failed to fetch banners')
        const data: Banner[] = await response.json()

        // Sort banners by date (newest first)
        const sortedBanners = data.sort(
          (a, b) =>
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
        )

        // If no banners from API, use only default images
        if (!sortedBanners || sortedBanners.length === 0) {
          setBanners(
            CAROUSEL_MAIN_IMAGES.map((img) => ({
              desktopImageUrl: img.src,
              mobileImageUrl: img.srcMobile,
            }))
          )
        } else {
          // Merge API banners with default images (without duplicates)
          setBanners([
            ...sortedBanners,
            ...CAROUSEL_MAIN_IMAGES.filter(
              (staticImg) =>
                !sortedBanners.some((b) => b.desktopImageUrl === staticImg.src)
            ).map((img) => ({
              desktopImageUrl: img.src,
              mobileImageUrl: img.srcMobile,
            })),
          ])
        }
      } catch (error) {
        // On error, use only fallback images
        setBanners(
          CAROUSEL_MAIN_IMAGES.map((img) => ({
            desktopImageUrl: img.src,
            mobileImageUrl: img.srcMobile,
          }))
        )
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
            {/* Render banners as carousel items */}
            {banners.map((item, index) => (
              <CarouselItem key={index} className="relative h-full">
                <picture className="relative h-full">
                  {/* Responsive source for mobile devices */}
                  <source
                    srcSet={item.mobileImageUrl || item.desktopImageUrl}
                    media="(max-width: 768px)"
                  />
                  {/* Fallback to desktop image */}
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
          {/* Carousel navigation buttons */}
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
