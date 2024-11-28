import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		// Підключаємося до MongoDB
		const client = await MongoClient.connect(process.env.MONGODB_URI!)
		const db = client.db()

		// Знаходимо перший документ в колекції Settings
		const settings = await db.collection('Settings').findOne()

		client.close() // Закриваємо підключення

		if (!settings) {
			console.warn('Не знайдено документ у колекції Settings')
			return NextResponse.json({ isOrderingOpen: false })
		}

		// Повертаємо потрібні дані
		return NextResponse.json({
			isOrderingOpen: settings.isOrderingOpen || false,
			orderWaitTime: settings.orderWaitTime || null,
			deliveryCost: settings.deliveryCost || null
		})
	} catch (error) {
		console.error('Помилка при отриманні налаштувань:', error)
		return NextResponse.json({ isOrderingOpen: false }, { status: 500 })
	}
}
