import { NextResponse } from 'next/server'
import { coverOf, listArticles, SITE, TOPICS } from '@/lib/data'

export const revalidate = 60

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: Request) {
  const n = Math.min(12, Math.max(1, Number(new URL(req.url).searchParams.get('limit')) || 3))
  try {
    const docs = await listArticles(n)
    const items = docs.map((a) => {
      const c = coverOf(a)
      return {
        title: a.title,
        excerpt: a.excerpt,
        url: `${SITE}/${a.slug}`,
        image: c?.url ?? null,
        imageAlt: c?.alt ?? null,
        topic: a.topic ? TOPICS[a.topic] : null,
        publishedAt: a.publishedAt ?? null,
      }
    })
    return NextResponse.json({ items }, { headers: CORS })
  } catch {
    return NextResponse.json({ items: [] }, { headers: { ...CORS, 'Cache-Control': 'no-store' } })
  }
}
