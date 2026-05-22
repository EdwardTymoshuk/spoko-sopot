import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// API route to fetch main banners from the database
export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-store',
        },
      })
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db()

    const banners = await db
      .collection('MainBanner')
      .find({
        $and: [{ isActive: { $ne: false } }, { isArchived: { $ne: true } }],
      })
      .sort({ sortOrder: 1, order: 1, createdAt: -1 })
      .toArray()
    client.close()

    const response = NextResponse.json(banners)
    response.headers.set('Cache-Control', 'no-store')

    return response
  } catch (error) {
    console.error('❌ Błąd pobierania banerów:', error)
    return NextResponse.json(
      { message: 'Error fetching banners' },
      { status: 500 }
    )
  }
}
