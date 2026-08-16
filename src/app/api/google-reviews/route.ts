import { NextResponse } from 'next/server'
import { OPINIONS } from '@/config'

type GooglePlacesReview = {
  rating?: number
  text?: string
  time?: number
  relative_time_description?: string
  author_name?: string
}

type GooglePlacesResponse = {
  result?: {
    rating?: number
    user_ratings_total?: number
    reviews?: GooglePlacesReview[]
  }
  reviews?: GooglePlacesReview[]
  rating?: number
  userRatingCount?: number
}

export const revalidate = 60 * 60 * 24 * 7

const DEFAULT_LIMIT = 5
const MAX_LIMIT = 5
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7
const ONE_DAY_SECONDS = 60 * 60 * 24

const getFallbackReviews = (limit: number) => {
  const reviews = OPINIONS.slice(0, limit)
  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : null

  return {
    source: 'local_fallback',
    averageRating,
    totalReviews: OPINIONS.length,
    reviews,
  }
}

const cacheHeaders = {
  'Cache-Control': `public, s-maxage=${ONE_WEEK_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
}

export async function GET() {
  try {
    const limit = Math.min(DEFAULT_LIMIT, MAX_LIMIT)

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey || !placeId) {
      return NextResponse.json(getFallbackReviews(limit), { headers: cacheHeaders })
    }

    const endpoint = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    endpoint.searchParams.set('place_id', placeId)
    endpoint.searchParams.set('fields', 'rating,user_ratings_total,reviews')
    endpoint.searchParams.set('language', 'pl')
    endpoint.searchParams.set('reviews_sort', 'newest')
    endpoint.searchParams.set('key', apiKey)

    const response = await fetch(endpoint.toString(), {
      method: 'GET',
      next: {
        revalidate: ONE_WEEK_SECONDS,
        tags: ['google-reviews'],
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Places API error:', errorText)
      return NextResponse.json(getFallbackReviews(limit), { headers: cacheHeaders })
    }

    const data = (await response.json()) as GooglePlacesResponse
    const result = data.result ?? {}
    const reviews = (result.reviews ?? data.reviews ?? [])
      .slice()
      .sort((a, b) => {
        const aTime = a.time ?? 0
        const bTime = b.time ?? 0
        return bTime - aTime
      })
      .slice(0, limit)
      .map((review, index) => {
        const date =
          review.relative_time_description ||
          (review.time
            ? new Date(review.time * 1000).toLocaleDateString('pl-PL')
            : '')

        return {
          _id: `google-${index}-${review.time ?? 'unknown'}`,
          author: review.author_name ?? 'Gość',
          message: review.text ?? '',
          rating: review.rating ?? 5,
          date,
        }
      })
      .filter((review) => review.message.trim().length > 0)

    return NextResponse.json(
      {
        source: 'google_places',
        averageRating: result.rating ?? data.rating ?? null,
        totalReviews: result.user_ratings_total ?? data.userRatingCount ?? null,
        reviews,
      },
      {
        headers: cacheHeaders,
      }
    )
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json(getFallbackReviews(DEFAULT_LIMIT), { headers: cacheHeaders })
  }
}
