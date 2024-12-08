import { NextResponse } from 'next/server'
import { env } from 'process'

export function middleware() {
	return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}/maintenance`)
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|maintenance|img/).*)',
	],
}
