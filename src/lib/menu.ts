// /lib/menu.ts
import { MenuItemType } from '@/app/types'
import { allowedCategories } from '@/config'

// Fetch menu items with `isOrderable: true` only
export async function fetchMenuItems(): Promise<MenuItemType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/menu?timestamp=${Date.now()}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch menu items')
    }
    const data = await response.json()

    return data.filter(
      (item: MenuItemType) =>
        item.isActive && allowedCategories.includes(item.category)
    )
  } catch (error) {
    console.error('Error fetching menu:', error)
    return []
  }
}
