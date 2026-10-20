import type { Metadata } from 'next'
import React from 'react'
import './styles.css'
import { MAIN_SITE, SITE } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Artículos | Human Technologies', template: '%s | Human Technologies' },
  description:
    'Ideas prácticas para la manufactura guatemalteca: datos de planta, personas y decisiones financieras.',
  openGraph: { siteName: 'Human Technologies', locale: 'es_GT', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="top">
          <div className="wrap nav">
            <a className="brand" href={`${MAIN_SITE}/`} aria-label="Human Technologies, inicio">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="19" cy="6" r="3.6" fill="#fff" />
                <path d="M5 5l9 9m-2 14l3-12 8-8" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 27c1-4 2-8 3-12" stroke="#6AC14C" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
              Human Technologies
            </a>
            <ul>
              <li><a href={`${MAIN_SITE}/#planta`}>Planta</a></li>
              <li><a href={`${MAIN_SITE}/#equipos`}>Personas</a></li>
              <li><a href={`${MAIN_SITE}/#resultados`}>Finanzas</a></li>
              <li><a href="/" aria-current="page">Artículos</a></li>
              <li><a href={`${MAIN_SITE}/#humantechnologies`}>Human Technologies</a></li>
            </ul>
            <a className="btn" href={`${MAIN_SITE}/#contacto`}>Contáctenos</a>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="wrap foot">
            <span>© Human Technologies · Guatemala. Todos los derechos reservados.</span>
            <a href={MAIN_SITE}>{MAIN_SITE.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
