// /app/api/menu/route.ts
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// API route to fetch menu items from the database
export async function GET() {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URI!)
		const db = client.db()

		// Fetch menu items from the 'MenuItem' collection
		const menuItems = await db.collection('MenuItem').find({ isOrderable: true }).toArray()
		// Close the database connection
		client.close()

		// Return the menu items as JSON
		return NextResponse.json(menuItems)
	} catch (error) {
		console.error('Error fetching menu items:', error)
		return NextResponse.json({ message: 'Error fetching menu items' }, { status: 500 })
	}
}