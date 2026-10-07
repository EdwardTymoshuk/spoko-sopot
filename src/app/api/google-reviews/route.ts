import { NextResponse } from 'next/server'
import { GOOGLE_REVIEWS_SNAPSHOT } from '@/config/googleReviewsSnapshot'

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7
const ONE_DAY_SECONDS = 60 * 60 * 24

export function GET() {
  return NextResponse.json(
    {
      source: 'local_snapshot',
      ...GOOGLE_REVIEWS_SNAPSHOT,
    },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${ONE_WEEK_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    }
  )
}
