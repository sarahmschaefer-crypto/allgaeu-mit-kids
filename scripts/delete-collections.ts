/**
 * scripts/delete-collections.ts — entfernt die 6 Sammel-/Guide-Docs (Mehr-Orte-
 * Beiträge, versehentlich als Einzelziel importiert). Löscht aus der Cloud-DB
 * (Vercel Postgres) UND aus data/content.json. Sicherheits-Guard: löscht nur,
 * wenn das Ziel ein Entwurf (published=false) ist.
 *
 * Aufruf:  npx tsx scripts/delete-collections.ts
 * (.env.local wird geladen → POSTGRES_URL aktiv → Cloud-DB)
 */
import { promises as fs, readFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DATA_FILE = path.join(ROOT, 'data', 'content.json')

const IDS = [
  'erlebniswege-sammlung-allgaeu',
  'moor-erlebniswege-allgaeu',
  'kinderwagen-touren-allgaeu',
  'ammerseeguide',
  'lindau-insel-ausflug',
  'korsika-mit-kindern',
]

// .env.local laden (tsx lädt es nicht automatisch).
try {
  for (const line of readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch { /* .env.local optional */ }

async function main() {
  // ── Cloud-DB ──
  if (process.env.POSTGRES_URL) {
    const { sql } = await import('@vercel/postgres')
    for (const id of IDS) {
      const { rows } = await sql`SELECT data->>'name' AS name, data->>'published' AS published FROM destinations WHERE id = ${id}`
      if (!rows.length) { console.log(`  · ${id}: nicht in Cloud (übersprungen)`); continue }
      if (rows[0].published === 'true') { console.log(`  ! ${id}: ist VERÖFFENTLICHT ("${rows[0].name}") → NICHT gelöscht`); continue }
      await sql`DELETE FROM destinations WHERE id = ${id}`
      console.log(`  ✓ Cloud gelöscht: ${id} ("${rows[0].name}")`)
    }
  } else {
    console.log('  (kein POSTGRES_URL → Cloud-Schritt übersprungen)')
  }

  // ── content.json ──
  const store = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
  const before = store.dests.length
  const toDelete = new Set(
    store.dests.filter((d: { id: string; published?: boolean }) => IDS.includes(d.id) && !d.published).map((d: { id: string }) => d.id),
  )
  store.dests = store.dests.filter((d: { id: string }) => !toDelete.has(d.id))
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2))
  console.log(`\n  content.json: ${before} → ${store.dests.length} Ziele (${toDelete.size} entfernt)`)
}

main().then(() => { console.log('\nFertig.'); process.exit(0) }).catch((e) => { console.error(e); process.exit(1) })
