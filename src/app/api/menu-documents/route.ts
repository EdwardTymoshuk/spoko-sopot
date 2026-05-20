import { MenuDownloadDocument } from '@/app/types'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseMenuDocuments = (value: unknown): MenuDownloadDocument[] => {
  if (!Array.isArray(value)) return []

  return value
    .filter(isObject)
    .map((document, index): MenuDownloadDocument => ({
      id: String(document.id ?? index),
      title: String(document.title ?? 'Menu'),
      type:
        document.type === 'drinks' || document.type === 'other'
          ? document.type
          : 'menu',
      url: typeof document.url === 'string' ? document.url : '',
      fileName:
        typeof document.fileName === 'string' ? document.fileName : undefined,
      size: typeof document.size === 'number' ? document.size : undefined,
      isActive:
        typeof document.isActive === 'boolean' ? document.isActive : true,
      sortOrder:
        typeof document.sortOrder === 'number' ? document.sortOrder : index,
      uploadedAt:
        typeof document.uploadedAt === 'string'
          ? document.uploadedAt
          : undefined,
    }))
    .filter((document) => document.isActive && document.url)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst({
      select: {
        menuDocuments: true,
      },
    })

    const response = NextResponse.json(
      parseMenuDocuments(settings?.menuDocuments)
    )

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')

    return response
  } catch (error) {
    console.error('Error fetching menu documents:', error)
    return NextResponse.json(
      { message: 'Error fetching menu documents' },
      { status: 500 }
    )
  }
}
