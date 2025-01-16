// /lib/menu.ts
import { MenuItemType } from '@/app/types'

// Fetch menu items with `isOrderable: true` only
export async function fetchMenuItems(): Promise<MenuItemType[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/menu`, { cache: 'no-store' })

		if (!response.ok) {
			throw new Error('Failed to fetch menu items')
		}
		const data = await response.json()
		// Filter items that are orderable
		return data.filter((item: MenuItemType) => item.isActive)
	} catch (error) {
		console.error('Error fetching menu:', error)
		return []
	}
}