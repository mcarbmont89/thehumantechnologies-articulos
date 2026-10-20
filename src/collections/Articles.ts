import type { CollectionConfig, FieldHook } from 'payload'
import { revalidatePath } from 'next/cache'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const makeSlug: FieldHook = ({ value, data, operation }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (operation === 'create' || !value) return slugify(String(data?.title ?? ''))
  return value
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Artículo', plural: 'Artículos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'topic', '_status', 'publishedAt'],
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { autosave: false }, maxPerDoc: 15 },
  access: {
    // El público solo ve lo publicado; quien inicia sesión ve todo.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?._status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/feed.json')
          if (doc?.slug) revalidatePath(`/${doc.slug}`)
          revalidatePath('/sitemap.xml')
        } catch {
          /* fuera del contexto de Next (scripts): se ignora */
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Título', required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumen',
      required: true,
      maxLength: 220,
      admin: { description: 'Una o dos frases. Se muestra en la tarjeta y en Google.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de portada',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Dirección (slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Se genera sola a partir del título. Solo cámbiela si hace falta.',
      },
      hooks: { beforeValidate: [makeSlug] },
    },
    {
      name: 'topic',
      type: 'select',
      label: 'Tema',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Planta', value: 'planta' },
        { label: 'Personas', value: 'personas' },
        { label: 'Finanzas', value: 'finanzas' },
        { label: 'Industrias', value: 'industrias' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
  ],
}
