// /app/api/menu/route.ts
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// Функція для отримання меню з бази даних
export async function GET() {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URI!)
		const db = client.db()

		// Отримуємо всі пункти меню з колекції 'menu'
		const menuItems = await db.collection('MenuItem').find().toArray()

		// Закриваємо клієнт
		client.close()

		// Повертаємо меню як JSON
		return NextResponse.json(menuItems)
	} catch (error) {
		console.error('Помилка при завантаженні меню:', error)
		return NextResponse.json({ message: 'Помилка при завантаженні меню' }, { status: 500 })
	}
}
