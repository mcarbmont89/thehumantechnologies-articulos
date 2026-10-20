import type { Metadata } from 'next'
import { coverOf, fmtDate, listArticles, TOPICS } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Artículos',
  alternates: { canonical: '/' },
}

export default async function Home() {
  let docs: Awaited<ReturnType<typeof listArticles>> = []
  try {
    docs = await listArticles()
  } catch {
    docs = []
  }
  return (
    <>
      <section className="intro">
        <div className="wrap">
          <h1>Artículos de interés</h1>
          <p>Ideas prácticas para la manufactura guatemalteca: datos de planta, personas y decisiones financieras.</p>
        </div>
      </section>
      <section className="list">
        <div className="wrap">
          {docs.length === 0 ? (
            <p className="empty">Pronto publicaremos los primeros artículos.</p>
          ) : (
            <div className="grid">
              {docs.map((a) => {
                const c = coverOf(a)
                return (
                  <a className="card" key={a.id} href={`/${a.slug}`}>
                    {c?.url ? <img src={c.url} alt={c.alt} loading="lazy" /> : <div className="ph" aria-hidden="true" />}
                    <div className="body">
                      <small>
                        {a.topic ? TOPICS[a.topic] : 'Artículo'} · {fmtDate(a.publishedAt)}
                      </small>
                      <h2>{a.title}</h2>
                      <p>{a.excerpt}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
