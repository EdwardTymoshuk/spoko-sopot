import { MenuDownloadDocument } from '@/app/types'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
}

const getSafeFileName = (document: MenuDownloadDocument) => {
  const fallback = `${document.title || 'menu'}.pdf`
  const fileName = document.fileName || fallback

  return fileName
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const settings = await prisma.settings.findFirst({
      select: {
        menuDocuments: true,
      },
    })

    const document = parseMenuDocuments(settings?.menuDocuments).find(
      (item) => item.id === params.id
    )

    if (!document) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    const upstreamResponse = await fetch(document.url, { cache: 'no-store' })

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { message: 'Document unavailable' },
        { status: upstreamResponse.status }
      )
    }

    const file = await upstreamResponse.arrayBuffer()
    const mode = request.nextUrl.searchParams.get('mode')
    const disposition = mode === 'preview' ? 'inline' : 'attachment'
    const fileName = getSafeFileName(document)

    return new NextResponse(file, {
      headers: {
        'Content-Type':
          upstreamResponse.headers.get('content-type') || 'application/pdf',
        'Content-Length': String(file.byteLength),
        'Content-Disposition': `${disposition}; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching menu document:', error)
    return NextResponse.json(
      { message: 'Error fetching menu document' },
      { status: 500 }
    )
  }
}
