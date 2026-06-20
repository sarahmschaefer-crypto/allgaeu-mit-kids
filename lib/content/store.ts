// lib/content/store.ts — Daten-Store hinter einem schmalen Interface.
// Backend-Wahl per Env: POSTGRES_URL gesetzt → Vercel Postgres (Phase 2),
// sonst lokale JSON-Datei (Phase 1). Die Verbraucher (Admin, Provider) kennen nur
// dieses Interface und bleiben unverändert.
//
// Server-only: importiert node:fs — niemals in eine Client-Komponente importieren.
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { DESTINATIONS } from '@/lib/shapes/data'
import { coverFromDest } from '@/lib/content/cover'
import type { ContentDest, ContentStore } from '@/lib/content/types'

const USE_PG = !!process.env.POSTGRES_URL

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'content.json')
const STORE_VERSION = 1

// Seed aus der heutigen data.ts — byte-identische Basisdaten, damit Vorher/Nachher
// (Phase 3) vergleichbar bleibt. Zusatzfelder: leere Fotos + Auto-Cover + leere Overrides.
function seed(): ContentStore {
  const dests: ContentDest[] = DESTINATIONS.map((d) => ({
    ...d,
    photos: [],
    cover: coverFromDest(d, []),
    overrides: {},
    published: true, // kuratierte Basis ist veröffentlicht
  }))
  return { version: STORE_VERSION, dests }
}

let cache: ContentStore | null = null

async function read(): Promise<ContentStore> {
  if (cache) return cache
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    cache = JSON.parse(raw) as ContentStore
  } catch {
    // Datei fehlt → erstmalig seeden und schreiben.
    cache = seed()
    await write(cache)
  }
  return cache
}

async function write(store: ContentStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8')
  cache = store
}

export async function getAllDests(): Promise<ContentDest[]> {
  if (USE_PG) return (await import('@/lib/content/store-pg')).pgGetAll()
  return (await read()).dests
}

export async function getContentDest(id: string): Promise<ContentDest | undefined> {
  if (USE_PG) return (await import('@/lib/content/store-pg')).pgGet(id)
  return (await read()).dests.find((d) => d.id === id)
}

// Partielles Update eines Ziels; gibt das aktualisierte Ziel zurück.
export async function updateDest(
  id: string,
  patch: Partial<ContentDest>,
): Promise<ContentDest | undefined> {
  if (USE_PG) return (await import('@/lib/content/store-pg')).pgUpdate(id, patch)
  const store = await read()
  const idx = store.dests.findIndex((d) => d.id === id)
  if (idx === -1) return undefined
  const next = { ...store.dests[idx], ...patch, id } // id bleibt fix
  store.dests[idx] = next
  await write(store)
  return next
}

export async function deleteDest(id: string): Promise<void> {
  if (USE_PG) return (await import('@/lib/content/store-pg')).pgDelete(id)
  const store = await read()
  store.dests = store.dests.filter((d) => d.id !== id)
  await write(store)
}
