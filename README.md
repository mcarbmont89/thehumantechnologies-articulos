# Artículos de Human Technologies

Mini CMS hecho con **Payload 3 + Next.js**. Carmelo escribe en `/admin`; los artículos salen en esta misma app
(`/`, `/<slug>`) y la landing los muestra leyendo `/feed.json`.

## Qué hay
- `/admin` panel en español: artículos (borrador/publicado), imágenes y usuarios.
- `/` listado, `/<slug>` artículo con SEO (título, descripción, Open Graph, datos estructurados), `/sitemap.xml`, `/robots.txt`.
- `/feed.json?limit=3` los últimos artículos publicados (con CORS abierto) para la landing.

## Desarrollo local
```
cp .env.example .env   # PAYLOAD_SECRET basta; usa SQLite local
npm install
npm run dev            # http://localhost:3000  (/admin crea el primer usuario)
```

## Despliegue en Vercel (resumen)
1. Importar este repositorio en Vercel (framework: Next.js; el comando de build es el de `package.json`).
2. Storage > crear **Neon Postgres** (Marketplace) y **Blob**. Vercel agrega `DATABASE_URL` y `BLOB_READ_WRITE_TOKEN`.
3. Variables de entorno: `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_MAIN_SITE_URL`.
4. Desplegar: el build aplica las migraciones (`payload migrate`) cuando hay base de datos.
5. Abrir `/admin` y crear el primer usuario (queda como administrador).
6. En la landing, pegar la dirección de esta app en `FEED_BASE` (script al final de `index.html`).

## Cambios de esquema
Si se agregan o cambian campos, generar una migración nueva con Postgres y subirla al repositorio:
`npm run payload migrate:create nombre`. En local sin Postgres, SQLite aplica los cambios sola.
