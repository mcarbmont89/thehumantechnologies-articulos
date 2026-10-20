import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
const postgresURL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

// Sitios que pueden leer la API desde el navegador (la landing).
const allowedOrigins = [
  serverURL,
  'https://xd.com.gt',
  'https://www.xd.com.gt',
  'https://www.thehumantechnologies.com',
  'https://thehumantechnologies.com',
  'https://thehumantechnologies.pages.dev',
  ...(process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',').map((s) => s.trim()) : []),
]

export default buildConfig({
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | Human Technologies' },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' },
  collections: [Articles, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresURL
    ? vercelPostgresAdapter({ pool: { connectionString: postgresURL } })
    : sqliteAdapter({ client: { url: process.env.SQLITE_URL || 'file:./articulos.db' } }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['articles'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${doc?.title ?? ''} | Human Technologies`,
      generateDescription: ({ doc }) => doc?.excerpt ?? '',
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            clientUploads: true,
          }),
        ]
      : []),
  ],
})
