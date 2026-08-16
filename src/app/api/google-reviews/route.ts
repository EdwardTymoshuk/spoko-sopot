import { NextResponse } from 'next/server'
import { OPINIONS } from '@/config'

type GooglePlacesReview = {
  rating?: number
  text?: { text?: string }
  publishTime?: string
  relativePublishTimeDescription?: string
  authorAttribution?: {
    displayName?: string
  }
}

type GooglePlacesResponse = {
  rating?: number
  userRatingCount?: number
  reviews?: GooglePlacesReview[]
}

export const revalidate = 60 * 60 * 24 * 7

const DEFAULT_LIMIT = 6
const MAX_LIMIT = 10
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

    const endpoint = `https://places.googleapis.com/v1/places/${placeId}?languageCode=pl&regionCode=PL`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'id,displayName,rating,userRatingCount,reviews.rating,reviews.text,reviews.publishTime,reviews.relativePublishTimeDescription,reviews.authorAttribution.displayName',
      },
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
    const reviews = (data.reviews ?? [])
      .slice()
      .sort((a, b) => {
        const aTime = a.publishTime ? new Date(a.publishTime).getTime() : 0
        const bTime = b.publishTime ? new Date(b.publishTime).getTime() : 0
        return bTime - aTime
      })
      .slice(0, limit)
      .map((review, index) => {
        const date =
          review.relativePublishTimeDescription ||
          (review.publishTime
            ? new Date(review.publishTime).toLocaleDateString('pl-PL')
            : '')

        return {
          _id: `google-${index}-${review.publishTime ?? 'unknown'}`,
          author: review.authorAttribution?.displayName ?? 'Gość',
          message: review.text?.text ?? '',
          rating: review.rating ?? 5,
          date,
        }
      })
      .filter((review) => review.message.trim().length > 0)

    return NextResponse.json(
      {
        source: 'google_places',
        averageRating: data.rating ?? null,
        totalReviews: data.userRatingCount ?? null,
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
