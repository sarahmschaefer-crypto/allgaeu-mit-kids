// lib/content/store-pg.ts — Postgres-Backend des Stores (Phase 2).
// Wird NUR genutzt, wenn POSTGRES_URL gesetzt ist (Vercel Postgres / Neon).
// Eine Tabelle, ganzes Ziel als JSONB — gleiche Datenform wie der Datei-Store.
import { sql } from '@vercel/postgres'
import { DESTINATIONS } from '@/lib/shapes/data'
import { coverFromDest } from '@/lib/content/cover'
import type { ContentDest } from '@/lib/content/types'

let ready: Promise<void> | null = null
function ensure() {
  if (!ready) ready = init()
  return ready
}
async function init() {
  await sql`CREATE TABLE IF NOT EXISTS destinations (
    id text PRIMARY KEY,
    sort serial,
    data jsonb NOT NULL
  )`
  const { rows } = await sql`SELECT count(*)::int AS n FROM destinations`
  if (rows[0].n === 0) {
    // Basis-Seed aus data.ts; echte Drive-Inhalte kommen via scripts/migrate-to-cloud.ts.
    for (const d of DESTINATIONS) {
      const cd: ContentDest = { ...d, photos: [], cover: coverFromDest(d, []), overrides: {}, published: true }
      await sql`INSERT INTO destinations (id, data) VALUES (${cd.id}, ${JSON.stringify(cd)}::jsonb)
                ON CONFLICT (id) DO NOTHING`
    }
  }
}

export async function pgGetAll(): Promise<ContentDest[]> {
  await ensure()
  const { rows } = await sql`SELECT data FROM destinations ORDER BY sort`
  return rows.map((r) => r.data as ContentDest)
}

export async function pgGet(id: string): Promise<ContentDest | undefined> {
  await ensure()
  const { rows } = await sql`SELECT data FROM destinations WHERE id = ${id}`
  return rows[0]?.data as ContentDest | undefined
}

export async function pgUpsert(dest: ContentDest): Promise<void> {
  await ensure()
  await sql`INSERT INTO destinations (id, data) VALUES (${dest.id}, ${JSON.stringify(dest)}::jsonb)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
}

export async function pgUpdate(id: string, patch: Partial<ContentDest>): Promise<ContentDest | undefined> {
  const cur = await pgGet(id)
  if (!cur) return undefined
  const next = { ...cur, ...patch, id }
  await pgUpsert(next)
  return next
}

export async function pgDelete(id: string): Promise<void> {
  await ensure()
  await sql`DELETE FROM destinations WHERE id = ${id}`
}
