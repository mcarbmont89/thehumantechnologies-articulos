import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { coverOf, fmtDate, getArticle, MAIN_SITE, SITE, TOPICS } from '@/lib/data'

export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = await getArticle(slug).catch(() => null)
  if (!a) return { title: 'Artículo no encontrado' }
  const seoImg = a.meta?.image && typeof a.meta.image !== 'number' ? (a.meta.image.url ?? null) : null
  const cover = coverOf(a, 'og')
  const img = seoImg || cover?.url
  const title = a.meta?.title?.replace(/ \| Human Technologies$/, '') || a.title
  const description = a.meta?.description || a.excerpt
  return {
    title,
    description,
    alternates: { canonical: `/${a.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: a.publishedAt ?? undefined,
      url: `${SITE}/${a.slug}`,
      images: img ? [{ url: img }] : undefined,
    },
    twitter: { card: img ? 'summary_large_image' : 'summary', title, description },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const a = await getArticle(slug).catch(() => null)
  if (!a) notFound()
  const c = coverOf(a, 'og')
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    image: c?.url ? [c.url] : undefined,
    mainEntityOfPage: `${SITE}/${a.slug}`,
    author: { '@type': 'Organization', name: 'Human Technologies' },
    publisher: { '@type': 'Organization', name: 'Human Technologies' },
  }
  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap narrow">
        <a className="back" href="/">← Todos los artículos</a>
        <small className="meta">
          {a.topic ? TOPICS[a.topic] : 'Artículo'} · {fmtDate(a.publishedAt)}
        </small>
        <h1>{a.title}</h1>
        <p className="lede">{a.excerpt}</p>
        {c?.url ? <img className="cover" src={c.url} alt={c.alt} /> : null}
        <div className="prose">
          <RichText data={a.content} />
        </div>
        <aside className="cta">
          <h2>¿Quiere medir su línea en tiempo real?</h2>
          <p>Cuéntenos qué produce y qué le gustaría mejorar.</p>
          <a className="btn" href={`${MAIN_SITE}/#contacto`}>Contáctenos</a>
        </aside>
      </div>
    </article>
  )
}
