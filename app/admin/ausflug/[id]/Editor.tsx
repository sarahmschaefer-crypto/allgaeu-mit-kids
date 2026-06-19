'use client'
// app/admin/ausflug/[id]/Editor.tsx — Inhalts-Editor (nur Inhalt, kein Design).
// Links das Formular, rechts die Live-Vorschau: das Cover IST das Vorschaubild.
import { useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AGES, BUDGETS, TIMES, TYPES, detailInfo, primaryTagOf } from '@/lib/shapes/data'
import type { CoverColor, ContentDest, CoverSpec } from '@/lib/content/types'
import { DestPreview } from '@/components/content/DestPreview'
import { saveDest, uploadPhoto } from '../../actions'

const TAG_LIST = Object.values(TYPES) as { id: string; label: string; color: string }[]

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? 'Speichert…' : 'Speichern'}
    </button>
  )
}

export function Editor({ dest }: { dest: ContentDest }) {
  // ── Inhalts-Felder ──
  const [name, setName] = useState(dest.name)
  const [place, setPlace] = useState(dest.place)
  const [blurb, setBlurb] = useState(dest.blurb)
  const [season, setSeason] = useState(dest.season)
  const [duration, setDuration] = useState(dest.duration)
  const [teaser, setTeaser] = useState(dest.teaser || '')
  const [budget, setBudget] = useState(dest.budget)
  const [time, setTime] = useState(dest.time)
  const [ages, setAges] = useState<string[]>(dest.ages)
  const [tags, setTags] = useState<string[]>(dest.tags || [])
  const [highlights, setHighlights] = useState((dest.highlights || []).join('\n'))
  const [adresse, setAdresse] = useState(dest.overrides?.adresse || '')
  const [oeffnung, setOeffnung] = useState(dest.overrides?.oeffnungszeiten || '')
  const [preis, setPreis] = useState(dest.overrides?.preis || '')

  // ── Cover-Felder ──
  const hasPhoto = dest.photos.length > 0
  const [bgType, setBgType] = useState<'photo' | 'color'>(dest.cover.bg.type)
  const [bgColor, setBgColor] = useState(dest.cover.bg.type === 'color' ? dest.cover.bg.color : '#9ba1ff')
  const [scrim, setScrim] = useState(dest.cover.scrim)
  const [sloganColor, setSloganColor] = useState<CoverColor>(dest.cover.sloganColor)
  const [sloganSize, setSloganSize] = useState(dest.cover.sloganSize)
  const [sloganBar, setSloganBar] = useState(dest.cover.sloganBar)
  const [sloganBarColor, setSloganBarColor] = useState<CoverColor>(dest.cover.sloganBarColor)
  const [stamp, setStamp] = useState<string | null>(dest.cover.stamp)

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  // Defaults für Platzhalter (wie heute abgeleitet), damit leere Overrides klar sind.
  const derived = useMemo(() => detailInfo({ ...dest, place, season, duration, budget }), [dest, place, season, duration, budget])

  // Live-Cover-Spec aus dem aktuellen Zustand.
  const cover: CoverSpec = useMemo(() => {
    const photoUrl = dest.photos[0]?.url
    return {
      format: 'feed',
      bg: bgType === 'photo' && photoUrl ? { type: 'photo', photoUrl } : { type: 'color', color: bgColor },
      scrim,
      slogan: teaser || name,
      sloganColor,
      sloganSize,
      sloganBar,
      sloganBarColor,
      stamp,
    }
  }, [dest.photos, bgType, bgColor, scrim, teaser, name, sloganColor, sloganSize, sloganBar, sloganBarColor, stamp])

  // Gesamter Patch, der beim Speichern als JSON mitgeht.
  const payload: Partial<ContentDest> = {
    name, place, blurb, season, duration, teaser,
    budget, time, ages, tags,
    highlights: highlights.split('\n').map((s) => s.trim()).filter(Boolean),
    overrides: {
      adresse: adresse.trim() || undefined,
      oeffnungszeiten: oeffnung.trim() || undefined,
      preis: preis.trim() || undefined,
    },
    cover,
  }

  const tagLabel = TAG_LIST.find((t) => t.id === primaryTagOf({ ...dest, tags }))

  return (
    <div className="adm-editor">
      {/* ───────── Formular ───────── */}
      <form action={saveDest}>
        <input type="hidden" name="id" value={dest.id} />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} readOnly />

        <h1 className="adm-h1">{name || 'Ausflugsziel'}</h1>
        <p className="adm-lead">Nur Inhalte – Layout & Design bleiben fest.</p>

        <section className="adm-section">
          <h2>Texte</h2>
          <div className="adm-field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Ort</label>
            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Cover-Slogan <span className="hint">(Werbespruch fürs Bild, nicht der Name)</span></label>
            <input type="text" value={teaser} onChange={(e) => setTeaser(e.target.value)} placeholder="z. B. Tiere zum Anfassen" />
          </div>
          <div className="adm-field">
            <label>Beschreibung</label>
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Highlights <span className="hint">(eins pro Zeile)</span></label>
            <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} />
          </div>
        </section>

        <section className="adm-section">
          <h2>Eckdaten</h2>
          <div className="adm-row">
            <div className="adm-field">
              <label>Saison</label>
              <input type="text" value={season} onChange={(e) => setSeason(e.target.value)} />
            </div>
            <div className="adm-field">
              <label>Dauer</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                {BUDGETS.map((b) => <option key={b.id} value={b.id}>{b.label} ({b.glyph})</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label>Zeitaufwand</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {TIMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-field">
            <label>Altersgruppen</label>
            <div className="adm-chips">
              {AGES.map((a) => (
                <label key={a.id} className="adm-chip" data-on={ages.includes(a.id)}>
                  <input type="checkbox" checked={ages.includes(a.id)} onChange={() => setAges(toggle(ages, a.id))} />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
          <div className="adm-field">
            <label>Kategorien (Tags)</label>
            <div className="adm-chips">
              {TAG_LIST.map((t) => (
                <label key={t.id} className="adm-chip" data-on={tags.includes(t.id)} style={tags.includes(t.id) ? undefined : { borderColor: t.color }}>
                  <input type="checkbox" checked={tags.includes(t.id)} onChange={() => setTags(toggle(tags, t.id))} />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="adm-section">
          <h2>Detailangaben</h2>
          <p className="hint" style={{ marginTop: -6, marginBottom: 12 }}>Leer lassen = automatisch aus den Eckdaten abgeleitet.</p>
          <div className="adm-field">
            <label>Adresse</label>
            <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder={derived.ort} />
          </div>
          <div className="adm-field">
            <label>Öffnungszeiten</label>
            <input type="text" value={oeffnung} onChange={(e) => setOeffnung(e.target.value)} placeholder={derived.oeffnungszeiten} />
          </div>
          <div className="adm-field">
            <label>Preis</label>
            <input type="text" value={preis} onChange={(e) => setPreis(e.target.value)} placeholder={derived.preis} />
          </div>
        </section>

        <section className="adm-section">
          <h2>Cover gestalten</h2>
          <div className="adm-field">
            <label>Hintergrund</label>
            <div className="adm-seg" role="radiogroup">
              <label data-on={bgType === 'photo'} aria-disabled={!hasPhoto} style={!hasPhoto ? { opacity: 0.45 } : undefined}>
                <input type="radio" name="bgtype" checked={bgType === 'photo'} disabled={!hasPhoto} onChange={() => setBgType('photo')} />
                Foto
              </label>
              <label data-on={bgType === 'color'}>
                <input type="radio" name="bgtype" checked={bgType === 'color'} onChange={() => setBgType('color')} />
                Farbfläche
              </label>
            </div>
            {!hasPhoto && <span className="hint">Noch kein Foto – lade unten eins hoch, um „Foto“ zu wählen.</span>}
          </div>
          {bgType === 'color' && (
            <div className="adm-field">
              <label>Flächenfarbe</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 56, height: 36, padding: 2 }} />
            </div>
          )}
          <div className="adm-field">
            <label>Scrim (Abdunklung fürs Lesen) — {Math.round(scrim * 100)}%</label>
            <input type="range" min={0} max={0.85} step={0.01} value={scrim} onChange={(e) => setScrim(Number(e.target.value))} />
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Schriftfarbe</label>
              <div className="adm-seg">
                <label data-on={sloganColor === 'ink'}><input type="radio" name="sc" checked={sloganColor === 'ink'} onChange={() => setSloganColor('ink')} />Ink</label>
                <label data-on={sloganColor === 'white'}><input type="radio" name="sc" checked={sloganColor === 'white'} onChange={() => setSloganColor('white')} />Weiß</label>
              </div>
            </div>
            <div className="adm-field">
              <label>Schriftgröße — {sloganSize.toFixed(2)}×</label>
              <input type="range" min={0.7} max={1.6} step={0.01} value={sloganSize} onChange={(e) => setSloganSize(Number(e.target.value))} />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-chip" data-on={sloganBar} style={{ width: 'fit-content' }}>
              <input type="checkbox" checked={sloganBar} onChange={() => setSloganBar(!sloganBar)} />
              Farbbalken hinter der Schrift
            </label>
          </div>
          {sloganBar && (
            <div className="adm-field">
              <label>Balkenfarbe</label>
              <div className="adm-seg">
                <label data-on={sloganBarColor === 'ink'}><input type="radio" name="bc" checked={sloganBarColor === 'ink'} onChange={() => setSloganBarColor('ink')} />Ink</label>
                <label data-on={sloganBarColor === 'white'}><input type="radio" name="bc" checked={sloganBarColor === 'white'} onChange={() => setSloganBarColor('white')} />Weiß</label>
              </div>
            </div>
          )}
          <div className="adm-field">
            <label>Kategorie-Stempel (oben rechts)</label>
            <select value={stamp ?? ''} onChange={(e) => setStamp(e.target.value || null)}>
              <option value="">— kein Stempel —</option>
              {TAG_LIST.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <p className="adm-note">
            Übergangs-Vorschau: Slogan in Playfair Display. Der finale Cover-Builder (Baby&nbsp;Mango,
            Rahmen, Blobs, Brand-Grafiken, Foto-Stempel) wird hier eingehängt, sobald das Cover-Tool fertig ist.
          </p>
        </section>

        <div className="adm-actions">
          <SaveButton />
          <a className="adm-btn ghost" href="/admin">Zurück zur Liste</a>
        </div>
      </form>

      {/* ───────── Live-Vorschau ───────── */}
      <aside className="adm-preview-col">
        <div>
          <span className="adm-card-mock lbl" style={{ display: 'block', marginBottom: 8 }}>So sieht die Karte aus</span>
          <div className="adm-card-mock">
            <DestPreview spec={cover} />
            {tagLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: tagLabel.color }} />
                <span className="lbl">{tagLabel.label}</span>
              </div>
            )}
            <div className="ttl">{name}</div>
            <div className="pl">{place}</div>
          </div>
        </div>

        <div className="adm-card-mock">
          <span className="lbl" style={{ display: 'block', marginBottom: 10 }}>Fotos</span>
          {dest.photos.length > 0 ? (
            <div className="adm-photos" style={{ marginBottom: 12 }}>
              {dest.photos.map((p) => <img key={p.url} src={p.url} alt={p.alt || ''} />)}
            </div>
          ) : (
            <p className="hint" style={{ marginBottom: 12 }}>Noch keine Fotos.</p>
          )}
          <form action={uploadPhoto} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="hidden" name="id" value={dest.id} />
            <input type="file" name="photo" accept="image/*" required />
            <button type="submit" className="adm-btn ghost" style={{ alignSelf: 'flex-start' }}>Foto hochladen</button>
          </form>
        </div>
      </aside>
    </div>
  )
}
