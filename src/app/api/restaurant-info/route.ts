import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_INFO = {
  name: 'Restauracja Spoko',
  phone: '530 659 666',
  email: 'info@spokosopot.pl',
  address: 'Hestii 3, 81-731 Sopot',
}

const DEFAULT_HOURS = [1, 2, 3, 4, 5, 6, 7].map((day) => ({
  day,
  isClosed: false,
  start: day > 5 ? '08:00' : '10:00',
  end: '19:00',
}))

export async function GET() {
  const rows = await prisma.$queryRaw<Array<{
    restaurantInfo: unknown
    openingHours: unknown
    openingHourOverrides: unknown
  }>>`SELECT "restaurantInfo", "openingHours", "openingHourOverrides" FROM "Settings" ORDER BY "createdAt" ASC LIMIT 1`
  const settings = rows[0]

  const info = settings?.restaurantInfo && typeof settings.restaurantInfo === 'object'
    ? { ...DEFAULT_INFO, ...(settings.restaurantInfo as Record<string, unknown>) }
    : DEFAULT_INFO

  const openingHours = Array.isArray(settings?.openingHours) && settings.openingHours.length > 0
    ? settings.openingHours
    : DEFAULT_HOURS

  const openingHourOverrides = Array.isArray(settings?.openingHourOverrides)
    ? settings.openingHourOverrides
    : []

  return NextResponse.json(
    { restaurantInfo: info, openingHours, openingHourOverrides },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
