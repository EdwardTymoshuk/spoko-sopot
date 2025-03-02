import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// API route to fetch main banners from the database
export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db()

    // Pobranie banerów z kolekcji 'MainBanner'
    const banners = await db.collection('MainBanner').find().toArray()
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
