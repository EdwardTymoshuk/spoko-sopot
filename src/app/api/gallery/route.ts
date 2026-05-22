import {
  fallbackGalleryPhotos,
  GalleryCategory,
  GalleryPhoto,
} from '@/lib/gallery'
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const allowedCategories: GalleryCategory[] = [
  'dishes',
  'terrace',
  'interior',
  'events',
  'details',
]

const normalizeCategory = (value: unknown): GalleryCategory => {
  return allowedCategories.includes(value as GalleryCategory)
    ? (value as GalleryCategory)
    : 'details'
}

const normalizeGalleryPhoto = (item: any, index: number): GalleryPhoto | null => {
  const src = item.src || item.image || item.url
  if (!src || typeof src !== 'string') return null

  const title = String(item.title || item.name || 'Zdjęcie z galerii')

  return {
    id: String(item._id || item.id || `gallery-${index}`),
    title,
    alt: String(item.alt || title),
    src,
    thumbnail:
      typeof item.thumbnail === 'string' && item.thumbnail ? item.thumbnail : src,
    category: normalizeCategory(item.category),
    width: Number(item.width) || 1200,
    height: Number(item.height) || 900,
    sortOrder: Number(item.sortOrder ?? index),
    isFeatured: Boolean(item.isFeatured),
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(fallbackGalleryPhotos)
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db()

    const items = await db
      .collection('Gallery')
      .find({
        $and: [{ isActive: { $ne: false } }, { isArchived: { $ne: true } }],
      })
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray()

    client.close()

    const photos = items
      .map(normalizeGalleryPhoto)
      .filter((item): item is GalleryPhoto => Boolean(item))

    return NextResponse.json(photos.length > 0 ? photos : fallbackGalleryPhotos, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Błąd pobierania galerii:', error)
    return NextResponse.json(fallbackGalleryPhotos, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}

