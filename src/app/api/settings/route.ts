import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		// Connect to MongoDB
		const client = await MongoClient.connect(process.env.MONGODB_URI!)
		const db = client.db()

		// Retrieve the first document from the 'Settings' collection
		const settings = await db.collection('Settings').findOne()

		client.close() // Close the database connection

		if (!settings) {
			console.warn('Nie znaleziono dokumentu w kolekcji Settings')
			return NextResponse.json({ isOrderingOpen: false })
		}

		// Ensure 'isOrderingOpen' is a boolean value
		const isOrderingOpen = typeof settings.isOrderingOpen === 'boolean' ? settings.isOrderingOpen : false

		// Return the settings data
		return NextResponse.json({
			isOrderingOpen: isOrderingOpen,
			orderWaitTime: settings.orderWaitTime || null,
			deliveryCost: settings.deliveryCost || null
		})
	} catch (error) {
		console.error('Błąd podczas pobierania ustawień:', error)
		return NextResponse.json({ isOrderingOpen: false }, { status: 500 })
	}
}
