/**
 * scripts/migrate-to-cloud.ts — einmalige Migration Datei-Store → Cloud.
 * Schiebt data/content.json nach Vercel Postgres und lädt lokale public/uploads-
 * Fotos nach Vercel Blob (URLs werden umgeschrieben).
 *
 * Aufruf (Env inline setzen — Werte aus dem Vercel-Dashboard):
 *   POSTGRES_URL="..." BLOB_READ_WRITE_TOKEN="..." npx tsx scripts/migrate-to-cloud.ts
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { sql } from '@vercel/postgres'
import { put } from '@vercel/blob'

const ROOT = process.cwd()
const DATA_FILE = path.join(ROOT, 'data', 'content.json')

async function main() {
  if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL fehlt — Wert aus dem Vercel-Postgres-Dashboard setzen.')
  const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN
  if (!useBlob) console.warn('⚠️  BLOB_READ_WRITE_TOKEN fehlt — Fotos werden NICHT hochgeladen (nur Texte/Daten).')

  const store = JSON.parse(await fs.readFile(DATA_FILE, 'utf8')) as { dests: any[] }

  await sql`CREATE TABLE IF NOT EXISTS destinations (
    id text PRIMARY KEY, sort serial, data jsonb NOT NULL
  )`

  let photosUp = 0
  for (const d of store.dests) {
    if (useBlob && Array.isArray(d.photos)) {
      for (const p of d.photos) {
        if (typeof p.url === 'string' && p.url.startsWith('/uploads/')) {
          try {
            const buf = await fs.readFile(path.join(ROOT, 'public', p.url.replace(/^\//, '')))
            const blob = await put(`uploads/${path.basename(p.url)}`, buf, { access: 'public', contentType: 'image/webp' })
            p.url = blob.url
            photosUp++
          } catch (e) {
            console.warn(`  ⚠️  Foto übersprungen ${p.url}: ${(e as Error).message}`)
          }
        }
      }
    }
    await sql`INSERT INTO destinations (id, data) VALUES (${d.id}, ${JSON.stringify(d)}::jsonb)
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
  }

  console.log(`✓ ${store.dests.length} Ziele → Postgres · ${photosUp} Fotos → Blob`)
}

main().catch((e) => { console.error(e); process.exit(1) })
