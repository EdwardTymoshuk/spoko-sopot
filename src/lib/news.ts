import { fetchAdminJson } from './adminApi'
import { MongoClient } from 'mongodb'

export interface NewsGalleryImage {
  src: string
  thumbnail: string
  width?: number
  height?: number
}

export interface NewsItem {
  id: string
  slug: string
  title: string
  image: string
  description: string
  fullDescription: string
  publishedAt?: string | Date | null
  eventStartDate?: string | Date | null
  eventEndDate?: string | Date | null
  isEnded?: boolean
  galleryImages: NewsGalleryImage[]
}

export const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

export const parseDate = (value?: string | Date | null) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value?: string | Date | null) => {
  const date = parseDate(value)
  return date ? dateFormatter.format(date) : null
}

export const isNewsEnded = (item: NewsItem) => {
  if (item.isEnded) return true
  const endDate = parseDate(item.eventEndDate)
  if (!endDate) return false
  return endDate.getTime() < Date.now()
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const valentinesEvent: NewsItem = {
  id: 'valentines-2026',
  slug: 'walentynki-2026',
  title: 'Wieczór Walentynkowy w Spoko',
  image: '/img/news/valentines-day-2026/valentines-1.webp',
  description:
    'Romantyczny wieczór dla dwojga: specjalne menu, muzyka na żywo i spokojna oprawa przy kolacji.',
  publishedAt: '2026-01-20',
  eventStartDate: '2026-02-14T17:00:00+01:00',
  eventEndDate: '2026-02-14T19:00:00+01:00',
  fullDescription: `
    <section>
      <p>
        Zapraszamy na wieczór walentynkowy w Spoko: kolację dla dwojga,
        specjalne menu, muzykę na żywo i oprawę przygotowaną z myślą o
        spokojnym spotkaniu przy stole.
      </p>

      <p>
        Menu wieczoru obejmuje przystawkę, danie główne, deser do dzielenia
        oraz dwa koktajle dla pary. Do wyboru przygotowujemy między innymi
        burratę z truflą i gruszką, rostbef z chipsem z parmezanu, kaczkę z
        puree dyniowym, sandacza z kruszonką z topinamburu oraz fondant Yin &
        Yang z sorbetem gruszkowym.
      </p>

      <p>
        Cena kolacji wynosi <strong>400 zł za parę</strong>. Liczba miejsc jest
        ograniczona, dlatego zachęcamy do wcześniejszej rezerwacji.
      </p>

      <p>
        Rezerwacje przyjmujemy telefonicznie pod numerem
        <a href="tel:+48530659666" class="font-semibold text-secondary hover:text-primary">530 659 666</a>
        oraz mailowo:
        <a href="mailto:info@spokosopot.pl" class="font-semibold text-secondary hover:text-primary">info@spokosopot.pl</a>.
      </p>
    </section>
  `,
  galleryImages: [
    {
      src: '/img/news/valentines-day-2026/valentines-1.webp',
      thumbnail: '/img/news/valentines-day-2026/valentines-1.webp',
      width: 1080,
      height: 1920,
    },
    {
      src: '/img/news/valentines-day-2026/valentines-2.webp',
      thumbnail: '/img/news/valentines-day-2026/valentines-2.webp',
      width: 1080,
      height: 1920,
    },
  ],
}

const normalizeImage = (image: unknown): NewsGalleryImage | null => {
  if (typeof image === 'string') {
    return { src: image, thumbnail: image }
  }

  if (!image || typeof image !== 'object') {
    return null
  }

  const record = image as Record<string, unknown>
  const src = record.src || record.url || record.image || record.imageUrl
  const thumbnail = record.thumbnail || record.thumb || src
  const width = Number(record.width)
  const height = Number(record.height)

  if (typeof src !== 'string') {
    return null
  }

  return {
    src,
    thumbnail: typeof thumbnail === 'string' ? thumbnail : src,
    width: Number.isFinite(width) ? width : undefined,
    height: Number.isFinite(height) ? height : undefined,
  }
}

const normalizeNewsItem = (item: any): NewsItem => {
  const id = item._id?.toString?.() || item.id?.toString?.() || slugify(item.title || 'aktualnosc')
  const title = item.title || 'Aktualność'
  const slug = item.slug || slugify(title) || id

  return {
    id,
    slug,
    title,
    image: item.image || item.thumbnail || '/img/news-page.jpg',
    description: item.description || '',
    fullDescription: item.fullDescription || item.content || item.description || '',
    publishedAt: item.publishedAt || item.createdAt || item.date || null,
    eventStartDate: item.eventStartDate || item.startDate || null,
    eventEndDate: item.eventEndDate || item.endDate || null,
    isEnded: Boolean(item.isEnded || item.isFinished || item.finished),
    galleryImages: ((item.galleryImages || item.images || []) as unknown[])
      .map(normalizeImage)
      .filter((image): image is NewsGalleryImage => Boolean(image)),
  }
}

export const sortNewsItems = (items: NewsItem[]) =>
  [...items].sort((a, b) => {
    const aDate = parseDate(a.publishedAt)?.getTime() ?? 0
    const bDate = parseDate(b.publishedAt)?.getTime() ?? 0
    return bDate - aDate
  })

const mergeNewsItems = (items: NewsItem[]) => {
  const bySlug = new Map<string, NewsItem>()

  items.forEach((item) => {
    bySlug.set(item.slug || item.id, item)
  })

  return sortNewsItems(Array.from(bySlug.values()))
}

const getAdminNewsItems = async () => {
  const items = await fetchAdminJson<unknown[]>('/api/public/news')
  if (!Array.isArray(items)) return []

  return sortNewsItems(items.map(normalizeNewsItem))
}

const getLegacyNewsItems = async () => {
  if (!process.env.MONGODB_URI) {
    return [valentinesEvent]
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db()
  const news = await db.collection('News').find().toArray()

  await client.close()

  return sortNewsItems([valentinesEvent, ...news.map(normalizeNewsItem)])
}

export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const adminNews = await getAdminNewsItems()
    if (adminNews.length > 0) {
      return mergeNewsItems([...adminNews, valentinesEvent])
    }

    return getLegacyNewsItems()
  } catch (error) {
    console.error('Błąd pobierania aktualności:', error)
    return [valentinesEvent]
  }
}

export async function getNewsItemBySlug(slug: string) {
  const news = await getNewsItems()
  return news.find((item) => item.slug === slug || item.id === slug) ?? null
}
