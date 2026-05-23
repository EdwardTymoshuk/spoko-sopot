import { fetchAdminJson } from '@/lib/adminApi'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const normalizeBanner = (item: any, index: number) => ({
  id: String(item.id || item._id || `main-banner-${index}`),
  src: item.src || item.image || item.imageUrl || item.desktopImage || item.desktopImageUrl,
  srcMobile:
    item.srcMobile ||
    item.mobileImage ||
    item.mobileImageUrl ||
    item.desktopImageUrl ||
    item.src ||
    item.image,
  linkUrl: item.linkUrl || null,
  sortOrder: Number(item.sortOrder ?? item.order ?? item.position ?? index),
  isActive: item.isActive,
  isArchived: item.isArchived,
  eyebrow: item.eyebrow,
  title: item.title,
  description: item.description,
  primaryCta: item.primaryCta,
  secondaryCta: item.secondaryCta,
})

// API route to fetch main banners from the database
export async function GET() {
  try {
    const adminBanners = await fetchAdminJson<unknown[]>('/api/public/main-banners')
    if (Array.isArray(adminBanners)) {
      const banners = adminBanners
        .map(normalizeBanner)
        .filter((item) => item.src && item.isActive !== false && item.isArchived !== true)
        .sort((a, b) => a.sortOrder - b.sortOrder)

      if (banners.length > 0) {
        const response = NextResponse.json(banners)
        response.headers.set('Cache-Control', 'no-store')
        return response
      }
    }

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

    const response = NextResponse.json(banners.map(normalizeBanner))
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
