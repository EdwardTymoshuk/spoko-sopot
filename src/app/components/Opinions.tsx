'use client'

import { OPINIONS } from '@/config'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { MongoDBReview } from '../types'
import LoadingButton from './LoadingButton'
import MaxWidthWrapper from './MaxWidthWrapper'
import OpinionBlock from './OpinionBlock'
import PageContainer from './PageContainer'
import PageSubHeader from './PageSubHeader'
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
    <MaxWidthWrapper>
      <PageSubHeader title="Nasi goście o nas" />

      <PageContainer className="pt-0 pb-4">
        <div className="inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm">
          <span className="font-semibold">
            {averageRating ?? fallbackAverage ?? 0} / 5
          </span>
          <span className="text-muted-foreground">
            Średnia ocena {totalReviews ? `(${totalReviews} opinii)` : ''}
          </span>
        </div>
      </PageContainer>

      <Carousel className="w-full h-full">
        <CarouselContent className="relative h-full m-0">
          {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="relative h-full p-4 self-center"
              >
                <OpinionBlock opinion={review} />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>

      <PageContainer className="pt-2 pb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <LoadingButton
            isLoading={isLoading}
            onClick={navigateToGoogleReviews}
            variant="default"
          >
            Zobacz więcej <MdOutlineKeyboardArrowRight />
          </LoadingButton>

          <a
            href="https://search.google.com/local/writereview?placeid=ChIJH1Ln3m4L_UYR73bJ708kSjI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            Zostaw opinię w Google
          </a>
        </div>
      </PageContainer>
    </MaxWidthWrapper>
  )
}

export default Opinions
