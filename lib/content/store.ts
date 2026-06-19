// lib/content/store.ts — Daten-Store hinter einem schmalen Interface.
// PHASE 1: JSON-Datei auf der Platte (läuft lokal sofort, keine Infra).
// PHASE 2: NUR diese Datei wird auf Vercel Postgres umgestellt — die Verbraucher
// (Admin, Provider) bleiben unverändert, weil sie nur dieses Interface kennen.
//
// Server-only: importiert node:fs — niemals in eine Client-Komponente importieren.
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { DESTINATIONS } from '@/lib/shapes/data'
import { coverFromDest } from '@/lib/content/cover'
import type { ContentDest, ContentStore } from '@/lib/content/types'

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
  return (await read()).dests
}

export async function getContentDest(id: string): Promise<ContentDest | undefined> {
  return (await read()).dests.find((d) => d.id === id)
}

// Partielles Update eines Ziels; gibt das aktualisierte Ziel zurück.
export async function updateDest(
  id: string,
  patch: Partial<ContentDest>,
): Promise<ContentDest | undefined> {
  const store = await read()
  const idx = store.dests.findIndex((d) => d.id === id)
  if (idx === -1) return undefined
  const next = { ...store.dests[idx], ...patch, id } // id bleibt fix
  store.dests[idx] = next
  await write(store)
  return next
}
