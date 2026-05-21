'use client'

import { OPINIONS } from '@/config'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { MongoDBReview } from '../types'
import LoadingButton from './LoadingButton'
import MaxWidthWrapper from './MaxWidthWrapper'
import OpinionBlock from './OpinionBlock'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

const Opinions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [reviews, setReviews] = useState<MongoDBReview[]>(OPINIONS)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalReviews, setTotalReviews] = useState<number | null>(
    OPINIONS.length
  )

  const fallbackAverage = useMemo(() => {
    if (OPINIONS.length === 0) return null
    const sum = OPINIONS.reduce((acc, review) => acc + review.rating, 0)
    return Number((sum / OPINIONS.length).toFixed(1))
  }, [])

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews?limit=6', {
          cache: 'no-store',
        })

        if (!response.ok) return

        const data = await response.json()
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews)
          setAverageRating(data.averageRating ?? null)
          setTotalReviews(data.totalReviews ?? null)
        }
      } catch (error) {
        console.error('Unable to fetch Google reviews:', error)
      }
    }

    fetchGoogleReviews()
  }, [])

  const navigateToGoogleReviews = () => {
    setIsLoading(true)
    startTransition(() => {
      window.open(
        'https://www.google.com/maps/place/Restauracja+Spoko+Sopot/@54.4326013,18.5841072,17z/data=!4m8!3m7!1s0x46fd0b6edee7521f:0x324a244fefc976ef!8m2!3d54.4326013!4d18.5866821!9m1!1b1!16s%2Fg%2F11g0j6ltv2?entry=ttu&g_ep=EgoyMDI0MTIwNC4wIKXMDSoASAFQAw%3D%3D',
        '_blank',
        'noopener,noreferrer'
      )
    })

    setIsLoading(false)
  }

  return (
    <section className="w-full bg-[#f7f3ec] py-20">
      <MaxWidthWrapper>
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Opinie gości
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Nasi goście o nas
            </h2>
          </div>

          <div className="inline-flex w-fit items-center gap-3 border border-zinc-200 px-4 py-2 text-sm text-zinc-500">
            <span className="font-semibold text-secondary">
            {averageRating ?? fallbackAverage ?? 0} / 5
          </span>
            <span>
            Średnia ocena {totalReviews ? `(${totalReviews} opinii)` : ''}
          </span>
          </div>
        </div>

        <Carousel className="h-full w-full">
          <CarouselContent className="relative m-0 h-full">
          {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="relative h-full p-3 self-center md:basis-1/2"
              >
                <OpinionBlock opinion={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="right-[-3.5rem] hidden h-11 w-11 border-0 bg-transparent text-primary shadow-none hover:bg-transparent md:flex" />
          <CarouselPrevious className="left-[-3.5rem] hidden h-11 w-11 border-0 bg-transparent text-primary shadow-none hover:bg-transparent md:flex" />
        </Carousel>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LoadingButton
            isLoading={isLoading}
            onClick={navigateToGoogleReviews}
            variant="default"
            className="w-full max-w-72 gap-2.5 rounded-lg bg-secondary px-6 font-semibold text-white shadow-none hover:bg-secondary/90 sm:w-auto sm:max-w-none"
          >
            Zobacz więcej opinii
          </LoadingButton>

          <a
            href="https://search.google.com/local/writereview?placeid=ChIJH1Ln3m4L_UYR73bJ708kSjI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full max-w-72 items-center justify-center rounded-lg border border-zinc-300 px-5 text-sm font-semibold text-secondary transition-colors hover:border-primary hover:text-primary sm:w-auto sm:max-w-none"
          >
            Zostaw opinię w Google
          </a>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default Opinions
