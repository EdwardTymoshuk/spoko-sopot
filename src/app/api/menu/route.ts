import { getMenuCategorySortIndex } from '@/config'
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

    const response = NextResponse.json(
      menuItems.sort((a, b) => {
        const categoryDiff =
          getMenuCategorySortIndex(a.category) -
          getMenuCategorySortIndex(b.category)

        if (categoryDiff !== 0) return categoryDiff
        return a.name.localeCompare(b.name, 'pl')
      })
    )

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
