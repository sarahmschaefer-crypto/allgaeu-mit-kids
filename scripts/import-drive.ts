/**
 * scripts/import-drive.ts — Drive-Import (lokal, einmalig/gelegentlich).
 *
 * Liest eine LOKAL gesyncte Kopie der Drive-Struktur (Kategorie-Ordner →
 * Ziel-Unterordner mit Fotos + .docx, oder lose .docx im Kategorie-Ordner),
 * parst die halb-strukturierten Texte, wandelt HEIC→WebP und schreibt die Ziele
 * in den Content-Store (data/content.json).
 *
 * Aufruf:  npx tsx scripts/import-drive.ts [<staging-oder-sync-ordner>]
 * Default: scripts/.drive-staging
 *
 * Faithful zum Bulk-Weg: .docx via mammoth, HEIC via heic-convert+sharp. Für die
 * Stichprobe liegen statt Binärdaten reine text.txt + keine Fotos vor (Farbcover).
 * Unsichere Felder bleiben LEER (nicht raten) → im Admin nachpflegen.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import mammoth from 'mammoth'
import convert from 'heic-convert'
import sharp from 'sharp'
import { TYPES } from '../lib/shapes/data'
import type { ContentDest, CoverSpec, DestPhoto } from '../lib/content/types'

const ROOT = process.cwd()
const STAGING = path.resolve(ROOT, process.argv[2] || 'scripts/.drive-staging')
const DATA_FILE = path.join(ROOT, 'data', 'content.json')
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads')

// Kategorie-Ordnername (Drive) → Tag-Id (Designsystem).
const CAT_MAP: Record<string, string> = {
  Ausfluege: 'ausflug', Baden: 'schwimmen', Spielplaetze: 'spielplatz',
  'Sport & Bewegung': 'sport', Attraktionen: 'attraktion', Tierparks: 'tierpark',
  Kreatives: 'kreatives', Kultur: 'kultur', Shops: 'shop', Unterkuenfte: 'unterkunft',
  Gastronomie: 'gastro',
}

function slug(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Markdown-/Word-Escapes und Zierzeichen säubern.
function clean(t: string): string {
  return t.replace(/\\([!_.*~()-])/g, '$1').replace(/­/g, '').trim()
}

function cleanName(raw: string): string {
  return clean(raw)
    .replace(/\.(docx|txt)$/i, '')
    .replace(/^allgaeumitkids[_ ]texte[_ ]/i, '')
    .replace(/[_]+/g, ' ')
    .replace(/\s*[–-]\s*Kooperation.*$/i, '')
    .replace(/\bReel\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

type Parsed = {
  slogan: string
  blurb: string
  adresse: string
  place: string
  oeffnungszeiten: string
  preis: string
  budget: string
  stroller: boolean
  wegbeschaffenheit: string[]
  facilities: string[]
  missing: string[]
}

function parseText(text: string): Parsed {
  const lines = clean(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  // Slogan = erste Zeile nach „Text im Reel".
  let slogan = ''
  const reelIdx = lines.findIndex((l) => /^text im reel/i.test(l))
  if (reelIdx >= 0) {
    const after = lines[reelIdx].replace(/^text im reel:?/i, '').trim()
    slogan = after || lines.slice(reelIdx + 1).find((l) => !/^reel$/i.test(l)) || ''
  }
  if (!slogan) slogan = lines[0] || ''

  // Blurb = erster echter Caption-Satz (editoriale Beschreibung).
  const capIdx = lines.findIndex((l) => /^caption:?$/i.test(l))
  let blurb = ''
  if (capIdx >= 0) blurb = lines.slice(capIdx + 1).find((l) => l.length > 40) || ''
  if (!blurb) {
    // sonst: Reel-Body (zwischen Slogan und Caption), CTA-/@-Zeilen raus.
    const body = lines.slice(reelIdx >= 0 ? reelIdx + 1 : 1, capIdx >= 0 ? capIdx : undefined)
      .filter((l) => l !== slogan && !/^folge|^folgt|@/i.test(l))
    blurb = body.find((l) => l.length > 40) || body[0] || ''
  }

  // PLZ-Zeile → Adresse + Ort.
  const plzIdx = lines.findIndex((l) => /\b\d{5}\b/.test(l))
  let adresse = '', place = ''
  if (plzIdx >= 0) {
    const plzLine = lines[plzIdx]
    const prev = lines[plzIdx - 1] || ''
    // Straße steht oft in der Zeile davor (kurz, ohne Satzpunkt, keine eigene PLZ).
    const street = prev && prev.length < 42 && !/[.!?]$/.test(prev) && !/\b\d{5}\b/.test(prev) ? prev : ''
    adresse = (street ? street + ', ' : '') + plzLine
    place = (plzLine.match(/\b\d{5}\s+(.+)$/)?.[1] || '').replace(/[,.].*$/, '').trim()
  }

  // Öffnungszeiten.
  const oeffnungszeiten =
    lines.find((l) => /\bUhr\b/.test(l) || /geöffnet/i.test(l) || /täglich.*\d/i.test(l)) || ''

  // Preis + Budget-Einstufung.
  const freeLine = lines.find((l) => /kostenlos|kostenfrei|gratis|eintritt frei/i.test(l))
  const euroLine = lines.find((l) => /€/.test(l))
  const preis = freeLine || euroLine || ''
  let budget = ''
  if (freeLine) budget = 'frei'
  else if (euroLine) {
    const nums = [...euroLine.matchAll(/(\d+)(?:[.,](\d+))?\s*€/g)].map((m) => Number(m[1]))
    const max = nums.length ? Math.max(...nums) : 0
    budget = max === 0 ? '' : max <= 10 ? '€' : max <= 25 ? '€€' : '€€€'
  }

  // Wegbeschaffenheit / Kinderwagen.
  const accessLine = lines.find((l) => /kinderwagen|laufrad|fahrrad|buggy|barrierefrei|tauglich/i.test(l))
  const weg: string[] = []
  if (accessLine) {
    if (/kinderwagen/i.test(accessLine)) weg.push('Kinderwagen')
    if (/laufrad/i.test(accessLine)) weg.push('Laufrad')
    if (/fahrrad|fahrzeug/i.test(accessLine)) weg.push('Fahrrad')
    if (/barrierefrei/i.test(accessLine)) weg.push('Barrierefrei')
  }
  const stroller = !!accessLine && /kinderwagen/i.test(accessLine) && !/nicht.*kinderwagen|kinderwagen.*nicht|kein.*kinderwagen/i.test(accessLine)

  const facilities: string[] = []
  if (lines.some((l) => /parkplatz|parken|parkbucht/i.test(l))) facilities.push('Parkplatz')

  const missing: string[] = []
  if (!place) missing.push('Ort')
  if (!oeffnungszeiten) missing.push('Öffnungszeiten')
  if (!budget) missing.push('Budget/Preis')
  if (!weg.length) missing.push('Wegbeschaffenheit')

  return { slogan, blurb, adresse, place, oeffnungszeiten, preis, budget, stroller, wegbeschaffenheit: weg, facilities, missing }
}

function buildCover(p: Parsed, catTag: string, photos: DestPhoto[]): CoverSpec {
  const hasPhoto = photos.length > 0
  const color = (TYPES as Record<string, { color: string }>)[catTag]?.color ?? '#9ba1ff'
  return {
    format: 'feed',
    bg: hasPhoto ? { type: 'photo', photoUrl: photos[0].url } : { type: 'color', color },
    scrim: hasPhoto ? 0.42 : 0,
    slogan: p.slogan,
    sloganColor: hasPhoto ? 'white' : 'ink',
    sloganSize: 1,
    sloganBar: false,
    sloganBarColor: 'ink',
    stamp: catTag,
  }
}

// HEIC→WebP (+ Kopie für bereits webfähige Formate). Gibt die öffentliche URL zurück.
async function importPhoto(srcPath: string, id: string, idx: number): Promise<DestPhoto | null> {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    const ext = path.extname(srcPath).toLowerCase()
    const outName = `${id}-${idx}.webp`
    const outPath = path.join(UPLOAD_DIR, outName)
    let input: Buffer
    if (ext === '.heic' || ext === '.heif') {
      const buf = await fs.readFile(srcPath)
      const jpg = await convert({ buffer: buf as unknown as ArrayBuffer, format: 'JPEG', quality: 0.92 })
      input = Buffer.from(jpg)
    } else {
      input = await fs.readFile(srcPath)
    }
    await sharp(input).rotate().resize(1600, 2000, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(outPath)
    return { url: `/uploads/${outName}` }
  } catch (e) {
    console.warn(`  ⚠️  Foto übersprungen (${path.basename(srcPath)}): ${(e as Error).message}`)
    return null
  }
}

async function readText(file: string): Promise<string> {
  if (/\.docx$/i.test(file)) return (await mammoth.extractRawText({ path: file })).value
  return fs.readFile(file, 'utf8')
}

async function buildDest(name: string, catTag: string, textFile: string, photoFiles: string[]): Promise<ContentDest> {
  const id = slug(name)
  const text = await readText(textFile)
  const p = parseText(text)
  const photos: DestPhoto[] = []
  for (let i = 0; i < photoFiles.length; i++) {
    const ph = await importPhoto(photoFiles[i], id, i + 1)
    if (ph) photos.push(ph)
  }
  console.log(`• ${name} (${id}) — Slogan: „${p.slogan}" · Ort: ${p.place || '—'} · ${photos.length} Foto(s)` +
    (p.missing.length ? ` · nachpflegen: ${p.missing.join(', ')}` : ''))
  return {
    id, name: cleanName(name), place: p.place, cat: catTag,
    ages: [], time: '', budget: p.budget, weather: 'egal', stroller: p.stroller,
    map: { x: 50, y: 50 }, rating: 0, reviews: 0,
    blurb: p.blurb, highlights: [], facilities: p.facilities, season: '', duration: '',
    tags: [catTag], teaser: p.slogan,
    photos,
    cover: buildCover(p, catTag, photos),
    overrides: {
      adresse: p.adresse || undefined,
      oeffnungszeiten: p.oeffnungszeiten || undefined,
      preis: p.preis || undefined,
    },
  }
}

const IMG_RE = /\.(heic|heif|webp|jpe?g|png)$/i
const TEXT_RE = /\.(docx|txt)$/i

async function main() {
  const out: ContentDest[] = []
  const catDirs = await fs.readdir(STAGING, { withFileTypes: true }).catch(() => [])
  for (const cat of catDirs) {
    if (!cat.isDirectory()) continue
    const catTag = CAT_MAP[cat.name] || 'ausflug'
    const catPath = path.join(STAGING, cat.name)
    const entries = await fs.readdir(catPath, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(catPath, e.name)
      if (e.isDirectory()) {
        const files = await fs.readdir(full)
        const textFile = files.find((f) => TEXT_RE.test(f))
        if (!textFile) { console.warn(`  ⚠️  ${e.name}: keine Textdatei`); continue }
        const photos = files.filter((f) => IMG_RE.test(f)).map((f) => path.join(full, f))
        out.push(await buildDest(e.name, catTag, path.join(full, textFile), photos))
      } else if (TEXT_RE.test(e.name)) {
        out.push(await buildDest(cleanName(e.name), catTag, full, []))
      }
    }
  }

  // Upsert in den Store (nach id).
  const store = JSON.parse(await fs.readFile(DATA_FILE, 'utf8')) as { version: number; dests: ContentDest[] }
  for (const d of out) {
    const i = store.dests.findIndex((x) => x.id === d.id)
    if (i >= 0) store.dests[i] = { ...store.dests[i], ...d }
    else store.dests.push(d)
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8')
  console.log(`\n✓ ${out.length} Ziel(e) importiert → ${path.relative(ROOT, DATA_FILE)} (${store.dests.length} gesamt)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
