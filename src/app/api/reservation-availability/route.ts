import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const BLOCKING_REQUEST_STATUSES = ['accepted', 'confirmed', 'approved'] as const

type AvailabilityDay = {
  date: string
  isBlocked: boolean
  basePriceFrom: number | null
  reason?: string | null
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (value: unknown): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ days: [] as AvailabilityDay[] })
  }

  let client: MongoClient | null = null

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db()
    const blockedMap = new Map<string, AvailabilityDay>()

    const manualBlocked = await db
      .collection('ReservationBlockedDates')
      .find({ isBlocked: { $ne: false } })
      .toArray()

    for (const item of manualBlocked) {
      const parsedDate =
        parseDate(item.date) ?? parseDate(item.eventDate) ?? parseDate(item.day)
      if (!parsedDate) continue

      const dateKey = toDateKey(parsedDate)
      blockedMap.set(dateKey, {
        date: dateKey,
        isBlocked: true,
        basePriceFrom: null,
        reason:
          typeof item.reason === 'string' && item.reason.trim()
            ? item.reason.trim()
            : 'Termin zarezerwowany',
      })
    }

    const requests = await db
      .collection('ReservationRequests')
      .find({ status: { $in: BLOCKING_REQUEST_STATUSES } })
      .project({ eventDateKey: 1, eventDate: 1 })
      .toArray()

    for (const item of requests) {
      const dateKeyFromDb =
        typeof item.eventDateKey === 'string' ? item.eventDateKey.trim() : ''
      const parsedDate = dateKeyFromDb
        ? null
        : parseDate(item.eventDate)

      const dateKey = dateKeyFromDb || (parsedDate ? toDateKey(parsedDate) : '')
      if (!dateKey) continue
      if (blockedMap.has(dateKey)) continue

      blockedMap.set(dateKey, {
        date: dateKey,
        isBlocked: true,
        basePriceFrom: null,
        reason: 'Termin zarezerwowany',
      })
    }

    const days = Array.from(blockedMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    )

    return NextResponse.json({ days })
  } catch (error) {
    console.error('Błąd pobierania zajętych terminów rezerwacji:', error)
    return NextResponse.json({ days: [] as AvailabilityDay[] }, { status: 500 })
  } finally {
    if (client) await client.close()
  }
}
