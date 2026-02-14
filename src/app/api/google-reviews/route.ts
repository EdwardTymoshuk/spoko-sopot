import { NextResponse } from 'next/server'

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

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_LIMIT = 6
const MAX_LIMIT = 10

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = Number(searchParams.get('limit') ?? DEFAULT_LIMIT)
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(1, limitParam), MAX_LIMIT)
      : DEFAULT_LIMIT

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey || !placeId) {
      return NextResponse.json(
        { message: 'Missing Google Places configuration' },
        { status: 500 }
      )
    }

    const endpoint = `https://places.googleapis.com/v1/places/${placeId}?languageCode=pl&regionCode=PL`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'id,displayName,rating,userRatingCount,reviews.rating,reviews.text,reviews.publishTime,reviews.relativePublishTimeDescription,reviews.authorAttribution.displayName',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Places API error:', errorText)
      return NextResponse.json(
        { message: 'Failed to fetch Google reviews' },
        { status: 502 }
      )
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
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Expires: '0',
          Pragma: 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json(
      { message: 'Failed to fetch Google reviews' },
      { status: 500 }
    )
  }
}
