import { getNewsItems } from '@/lib/news'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const formattedNews = await getNewsItems()

    return NextResponse.json(formattedNews, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Błąd pobierania aktualności:', error)
    return NextResponse.json(
      { message: 'Błąd pobierania danych' },
      { status: 500 }
    )
  }
}
