import { getCanonicalMenuCategory, getMenuCategorySortIndex } from '@/config'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        isArchived: false,
      },
    })

    const normalizedItems = menuItems.map((item) => ({
      ...item,
      category: getCanonicalMenuCategory(item.category),
    }))

    const sortedItems = normalizedItems.sort((a, b) => {
      const categoryDiff =
        getMenuCategorySortIndex(a.category) -
        getMenuCategorySortIndex(b.category)

      if (categoryDiff !== 0) return categoryDiff
      return a.name.localeCompare(b.name, 'pl')
    })

    const latestUpdatedAt = sortedItems.reduce<Date | null>((latest, item) => {
      const updatedAt =
        item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt)
      if (Number.isNaN(updatedAt.getTime())) return latest
      return !latest || updatedAt > latest ? updatedAt : latest
    }, null)

    const response = NextResponse.json({
      items: sortedItems,
      updatedAt: latestUpdatedAt?.toISOString() ?? null,
    })

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set(
      'Vary',
      'RSC, Next-Router-State-Tree, Next-Router-Prefetch'
    )

    return response
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { message: 'Error fetching menu items' },
      { status: 500 }
    )
  }
}
