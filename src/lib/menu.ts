import { MenuItemType } from '@/app/types'

// /lib/menu.ts
export async function fetchMenuItems(): Promise<MenuItemType[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/menu`)
		if (!response.ok) {
			throw new Error('Failed to fetch menu items')
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching menu:', error)
		return []
	}
}
