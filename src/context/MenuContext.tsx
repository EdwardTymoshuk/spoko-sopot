// /context/MenuContext.tsx
'use client'

import { MenuItemType } from '@/app/types'
import { fetchMenuItems } from '@/lib/menu'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface MenuContextProps {
	menuItems: MenuItemType[]
	loading: boolean
	refetch: () => void
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

export const useMenu = () => {
	const context = useContext(MenuContext)
	if (!context) {
		throw new Error('useMenu must be used within a MenuProvider')
	}
	return context
}

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
	const [loading, setLoading] = useState(true)

	const loadMenu = async () => {
		setLoading(true)
		const items = await fetchMenuItems()
		setMenuItems(items)
		setLoading(false)
	}

	useEffect(() => {
		loadMenu()
	}, [])

	return (
		<MenuContext.Provider value={{ menuItems, loading, refetch: loadMenu }}>
			{children}
		</MenuContext.Provider>
	)
}
