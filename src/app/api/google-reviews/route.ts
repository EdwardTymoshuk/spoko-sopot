import { NextResponse } from 'next/server'
import { OPINIONS } from '@/config'

const DEFAULT_LIMIT = 5
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7
const ONE_DAY_SECONDS = 60 * 60 * 24

export function GET() {
  const reviews = OPINIONS.slice(0, DEFAULT_LIMIT)
  const averageRating = OPINIONS.length
    ? Number(
        (
          OPINIONS.reduce((sum, review) => sum + review.rating, 0) /
          OPINIONS.length
        ).toFixed(1)
      )
    : null

  return NextResponse.json(
    {
      source: 'local',
      averageRating,
      totalReviews: OPINIONS.length,
      reviews,
    },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${ONE_WEEK_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    }
  )
}
