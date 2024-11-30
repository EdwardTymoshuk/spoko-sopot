import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const secret = searchParams.get('secret')

	if (secret !== process.env.REVALIDATE_SECRET) {
		return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
	}

	try {
		// Викликаємо ревалідацію для сторінки `/menu`
		await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/menu`, {
			method: 'POST',
		})

		return NextResponse.json({ revalidated: true })
	} catch (error) {
		console.error('Помилка ревалідації:', error)
		return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
	}
}
