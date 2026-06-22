'use client'
// app/admin/ausflug/[id]/Editor.tsx — Inhalts-Editor (nur Inhalt, kein Design).
// Links das Formular, rechts die Live-Vorschau: das Cover IST das Vorschaubild.
import { useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AGES, BUDGETS, TIMES, TYPES, detailInfo, primaryTagOf } from '@/lib/shapes/data'
import type { ContentDest } from '@/lib/content/types'
import { DestCover } from '@/components/content/DestCover'
import { saveDest, uploadPhoto, deleteDest } from '../../actions'

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
  const [published, setPublished] = useState(dest.published ?? false)
  const [name, setName] = useState(dest.name)
  const [place, setPlace] = useState(dest.place)
  const [blurb, setBlurb] = useState(dest.blurb)
  const [description, setDescription] = useState(dest.description || '')
  const [tips, setTips] = useState(dest.tips || '')
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

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  // Defaults für Platzhalter (wie heute abgeleitet), damit leere Overrides klar sind.
  const derived = useMemo(() => detailInfo({ ...dest, place, season, duration, budget }), [dest, place, season, duration, budget])

  // Gesamter Patch, der beim Speichern als JSON mitgeht.
  const payload: Partial<ContentDest> = {
    published,
    name, place, blurb, description, tips, season, duration, teaser,
    budget, time, ages, tags,
    highlights: highlights.split('\n').map((s) => s.trim()).filter(Boolean),
    overrides: {
      adresse: adresse.trim() || undefined,
      oeffnungszeiten: oeffnung.trim() || undefined,
      preis: preis.trim() || undefined,
    },
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

        <label className="adm-publish" data-on={published}>
          <input type="checkbox" checked={published} onChange={() => setPublished(!published)} />
          <span className="dot" aria-hidden />
          <span>
            <strong>{published ? 'Veröffentlicht' : 'Entwurf'}</strong>
            <span className="hint" style={{ display: 'block' }}>
              {published ? 'Erscheint auf der öffentlichen Seite.' : 'Nur im Admin sichtbar – zum Veröffentlichen anhaken.'}
            </span>
          </span>
        </label>

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
            <label>Kurzbeschreibung <span className="hint">(1–2 Sätze, für Karten/Vorschau)</span></label>
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Beschreibung / Reisebericht <span className="hint">(der ausführliche Text)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 220 }} />
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
          <div className="adm-field">
            <label>Praktische Hinweise <span className="hint">(Tipps, eins pro Zeile)</span></label>
            <textarea value={tips} onChange={(e) => setTips(e.target.value)} placeholder="z. B. Feste Schuhe nötig · Mit dem Schiff erreichbar" />
          </div>
        </section>

        <p className="adm-note">
          Das <strong>Cover</strong> wird aus Foto + Slogan + Kategorie automatisch als echtes Vorlagen-Cover
          erzeugt (Vorschau rechts). Der frei gestaltbare Cover-Builder (Template wählen, Rahmen, Grafiken,
          Format, Export) kommt als nächster Schritt.
        </p>

        <div className="adm-actions">
          <SaveButton />
          <a className="adm-btn ghost" href="/admin">Zurück zur Liste</a>
          <a className="adm-btn ghost" href={`/ausflug/${dest.id}`} target="_blank" rel="noreferrer">Auf der Website ansehen ↗</a>
          <button
            type="submit"
            formAction={deleteDest}
            onClick={(e) => { if (!confirm(`„${name}" wirklich löschen?`)) e.preventDefault() }}
            className="adm-btn"
            style={{ marginLeft: 'auto', background: 'transparent', borderColor: '#b00020', color: '#b00020' }}
          >
            Löschen
          </button>
        </div>
      </form>

      {/* ───────── Live-Vorschau ───────── */}
      <aside className="adm-preview-col">
        <div>
          <span className="adm-card-mock lbl" style={{ display: 'block', marginBottom: 8 }}>So sieht die Karte aus</span>
          <div className="adm-card-mock">
            <DestCover dest={{ ...dest, name, place, teaser, tags }} style={{ borderRadius: 11 }} />
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
