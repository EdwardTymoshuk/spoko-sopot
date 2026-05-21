'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'
import { Button } from '@/app/components/ui/button'
import { CarouselImage } from '@/app/types'
import { CAROUSEL_MAIN_IMAGES } from '@/config'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { RxDoubleArrowDown } from 'react-icons/rx'

const defaultHeroCopy = {
  eyebrow: 'Restauracja Spoko',
  title: 'Spokojny smak Sopotu',
  description:
    'Kuchnia, wydarzenia i spotkania przy stole kilka kroków od plaży.',
}

const HeroCarousel = () => {
  const banners = useMemo<CarouselImage[]>(
    () =>
      CAROUSEL_MAIN_IMAGES.map((img) => ({
        ...img,
      })),
    []
  )

  // ------------------------------------------------------
  // SKELETON (full screen) while banners are loading
  // ------------------------------------------------------
  return (
    <div className="relative flex-grow overflow-hidden bg-zinc-900">
      <div className="relative h-screen w-full">
        <Carousel className="w-full h-full max-w-full">
          <CarouselContent className="h-full">
            {banners.map((item, index) => (
              <CarouselItem key={index} className="relative h-full">
                <div className="relative h-full w-full bg-zinc-900">
                  <picture>
                    <source
                      srcSet={item.srcMobile || item.src}
                      media="(max-width: 768px)"
                    />

                    <Image
                      src={item.src}
                      alt={`Banner ${index + 1}`}
                      className="object-cover"
                      fill
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </picture>

                  <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/52 to-black/16" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/24" />

                  <div className="absolute inset-x-0 bottom-0 top-20 flex items-center">
                    <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10">
                      <div className="max-w-2xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                          {item.eyebrow ?? defaultHeroCopy.eyebrow}
                        </p>

                        <h1 className="text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
                          {item.title ?? defaultHeroCopy.title}
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/82 md:text-xl">
                          {item.description ?? defaultHeroCopy.description}
                        </p>

                        {(item.primaryCta || item.secondaryCta) && (
                          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {item.primaryCta && (
                              <Button
                                asChild
                                size="lg"
                                className="h-12 gap-2.5 rounded-lg bg-primary px-6 font-semibold text-zinc-950 shadow-none hover:bg-primary/90"
                              >
                                {item.primaryCta.external ? (
                                  <a
                                    href={item.primaryCta.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.primaryCta.label}
                                  </a>
                                ) : (
                                  <Link href={item.primaryCta.href}>
                                    {item.primaryCta.label}
                                  </Link>
                                )}
                              </Button>
                            )}

                            {item.secondaryCta && (
                              <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="h-12 gap-2.5 rounded-lg border-white/55 bg-black/32 px-6 font-semibold text-white shadow-none backdrop-blur-sm hover:border-primary hover:bg-black/45 hover:text-white"
                              >
                                {item.secondaryCta.external ? (
                                  <a
                                    href={item.secondaryCta.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.secondaryCta.label}
                                  </a>
                                ) : (
                                  <Link href={item.secondaryCta.href}>
                                    {item.secondaryCta.label}
                                  </Link>
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
