import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db()

    const news = await db.collection('News').find().toArray()

    client.close()

    const formattedNews = news.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      image: item.image || '',
      description: item.description,
      fullDescription: item.fullDescription || '',
      galleryImages: (item.galleryImages || []).map((img: string) => ({
        src: img,
        thumbnail: img,
      })),
    }))

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
