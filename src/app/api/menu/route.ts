// /app/api/menu/route.ts
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// API route to fetch menu items from the database
export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db()

    // Fetch menu items from the 'MenuItem' collection
    const menuItems = await db
      .collection('MenuItem')
      .find({ isActive: true })
      .toArray()
    // Close the database connection
    client.close()

    // Return the menu items as JSON
    const response = NextResponse.json(menuItems)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
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
