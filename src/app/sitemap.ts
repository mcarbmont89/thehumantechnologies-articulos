import type { MetadataRoute } from 'next'
import { listArticles, SITE } from '@/lib/data'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await listArticles(500).catch(() => [])
  return [
    { url: SITE, changeFrequency: 'weekly', priority: 0.8 },
    ...docs.map((a) => ({
      url: `${SITE}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
