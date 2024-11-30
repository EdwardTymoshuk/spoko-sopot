// /app/api/reviews/route.ts
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// Функція для отримання відгуків з бази даних
export async function GET() {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URI!)
		const db = client.db()

		// Отримуємо всі відгуки з колекції 'reviews'
		const reviews = await db.collection('reviews').find().toArray()
		console.log(reviews)
		// Закриваємо клієнт
		client.close()

		// Повертаємо відгуки як JSON
		return NextResponse.json(reviews)
	} catch (error) {
		console.error('Помилка при завантаженні відгуків:', error)
		return NextResponse.json({ message: 'Помилка при завантаженні відгуків' }, { status: 500 })
	}
}
