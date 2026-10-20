import config from '@payload-config'
import { getPayload } from 'payload'
import type { Article, Media } from '@/payload-types'

export const SITE =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
export const MAIN_SITE = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.thehumantechnologies.com'

export const TOPICS: Record<string, string> = {
  planta: 'Planta',
  personas: 'Personas',
  finanzas: 'Finanzas',
  industrias: 'Industrias',
}

export const abs = (url?: string | null) =>
  !url ? null : /^https?:\/\//.test(url) ? url : `${SITE}${url}`

export function coverOf(a: Article, size: 'card' | 'og' = 'card') {
  const m = a.coverImage as Media | number | null | undefined
  if (!m || typeof m === 'number') return null
  const url = m.sizes?.[size]?.url || m.url
  return { url: abs(url), alt: m.alt || a.title }
}

export const fmtDate = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
    : ''

export async function listArticles(limit = 50) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs
}

export async function getArticle(slug: string) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'articles',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs[0] ?? null
}
