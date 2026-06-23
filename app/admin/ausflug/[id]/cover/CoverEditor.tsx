'use client'
// app/admin/ausflug/[id]/cover/CoverEditor.tsx — Instagram-artiger, mobile-first
// Cover-Builder. JEDER Layer editierbar (Increment 2): Fläche (Foto ↔ Farbfläche),
// Rahmen-Form, Scrim, Brand-Grafiken (Sticker), Kategorie-Stempel, Schrift (volle
// Palette, Farbbalken, Textmarker-Toggle, Marker-/Bandarolen-Farbe, Drag&Drop).
// Live-Vorschau mit Ziehen, Speichern + PNG-Export.
import { useEffect, useMemo, useRef, useState, useTransition, type CSSProperties } from 'react'
import { FigmaCover } from '@/components/cover/FigmaCover'
import { COVER_COLORS, type CoverColor } from '@/lib/cover/types'
import {
  resolveFigmaCover, PICKER_TEMPLATES, DEMO_PHOTOS, needsNumber,
  BRAND_COLORS, STICKER_GRAPHICS, FRAME_SHAPES, STAMP_CATEGORIES,
} from '@/lib/content/figma-cover'
import type { ContentDest, FigmaCoverChoice, CoverSticker } from '@/lib/content/types'
import { saveFigmaCover } from '@/app/admin/actions'

const swatchHex = (c: string) => (c === 'white' ? '#ffffff' : COVER_COLORS[c as CoverColor] ?? '#ccc')
const graphicSrc = (asset: string) => (asset === 'logo' ? '/logo-allgaeu.svg' : `/cover/graphics/${asset}.svg`)
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

// Responsives Layout: mobil gestapelt (Vorschau oben), ab 880px Vorschau LINKS
// (sticky) neben den Einstellungen → Änderung sofort im Blick.
const CB_CSS = `
.cb-root { max-width: 560px; margin: 0 auto; padding: 14px 14px 132px; }
.cb-main { display: flex; flex-direction: column; gap: 16px; }
.cb-preview { width: min(78vw, 330px); margin: 0 auto; }
.cb-controls { width: 100%; }
@media (min-width: 880px) {
  .cb-root { max-width: 960px; padding-bottom: 84px; }
  .cb-main { flex-direction: row; align-items: flex-start; gap: 30px; }
  .cb-preview { position: sticky; top: 18px; flex: 0 0 340px; width: 340px; margin: 0; }
  .cb-controls { flex: 1; min-width: 0; }
}
`

// Farbwähler-Reihe. `value`=aktuell, onPick(undefined)=erste „Auto/keiner"-Option.
function Swatches({ value, onPick, first }: { value?: string; onPick: (c?: string) => void; first: { label: string; bg: string } }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <button type="button" onClick={() => onPick(undefined)} title={first.label}
        style={{ width: 30, height: 30, borderRadius: '50%', border: !value ? '2.5px solid var(--ink)' : '1px solid var(--line)', background: first.bg, cursor: 'pointer' }} />
      {BRAND_COLORS.map((c) => (
        <button key={c} type="button" onClick={() => onPick(c)} title={c}
          style={{ width: 30, height: 30, borderRadius: '50%', border: value === c ? '2.5px solid var(--ink)' : '1px solid var(--line)', background: swatchHex(c), cursor: 'pointer' }} />
      ))}
    </div>
  )
}

// Rendert FigmaCover auf die gemessene Containerbreite (FigmaCover braucht eine Zahl).
function MeasuredCover({ dest }: { dest: ContentDest }) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => { const cw = Math.round(el.getBoundingClientRect().width); if (cw > 0) setW(cw) }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { template, content } = resolveFigmaCover(dest)
  return (
    <div ref={ref} style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 14, background: '#e9e4d8' }}>
      {w > 0 && <FigmaCover template={template} content={content} width={w} />}
    </div>
  )
}

type Tab = 'vorlage' | 'fläche' | 'schrift' | 'grafik' | 'stempel'
const TABS: Tab[] = ['vorlage', 'fläche', 'schrift', 'grafik', 'stempel']

export function CoverEditor({ dest }: { dest: ContentDest }) {
  const [choice, setChoice] = useState<FigmaCoverChoice>(dest.figmaCover ?? {})
  const [tab, setTab] = useState<Tab>('vorlage')
  const [sel, setSel] = useState<number | null>(null) // ausgewählter Sticker
  const [moveTarget, setMoveTarget] = useState<'title' | 'eyebrow'>('title') // was Drag im Schrift-Tab verschiebt
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportErr, setExportErr] = useState('')
  const [pending, startTransition] = useTransition()
  const fullRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ mode: string; ox: number; oy: number } | null>(null)
  const dragRaf = useRef(0)
  const dragPt = useRef<{ fx: number; fy: number } | null>(null)

  const update = (fn: (c: FigmaCoverChoice) => FigmaCoverChoice) => { setChoice(fn); setSaved(false) }
  const patch = (p: Partial<FigmaCoverChoice>) => update((c) => ({ ...c, ...p }))

  const merged = useMemo<ContentDest>(() => ({ ...dest, figmaCover: choice }), [dest, choice])
  const { template, content } = useMemo(() => resolveFigmaCover(merged), [merged])

  const hasPhotoBox = template.layers.some((l) => l.type === 'photo')
  const fillMode: 'photo' | 'color' = choice.fillMode ?? (hasPhotoBox ? 'photo' : 'color')
  const hasMarkerOrBand = template.layers.some((l) => l.type === 'marker' || l.type === 'band') || !!choice.textMarker
  const sloganLayer = template.layers.find((l) => (l.type === 'text' && l.field === 'slogan') || l.type === 'marker')
  const overlineLayer = template.layers.find((l) => l.type === 'text' && l.field === 'overline')

  const photoOptions = useMemo(() => {
    const real = (dest.photos ?? []).map((p) => p.url)
    return [...real, ...DEMO_PHOTOS]
  }, [dest.photos])
  const isDemo = (content.photo ?? '').includes('/cover/demo/')

  const stickers = choice.stickers ?? []
  const addSticker = (asset: string) => { update((c) => ({ ...c, stickers: [...(c.stickers ?? []), { asset, x: 0.5, y: 0.42, scale: 0.28 }] })); setSel(stickers.length) }
  const updateSticker = (i: number, p: Partial<CoverSticker>) => update((c) => { const s = [...(c.stickers ?? [])]; s[i] = { ...s[i], ...p }; return { ...c, stickers: s } })
  const removeSticker = (i: number) => { update((c) => ({ ...c, stickers: (c.stickers ?? []).filter((_, j) => j !== i) })); setSel(null) }

  // ── Ziehen auf der Vorschau (Fokus / Text / Sticker je nach Tab) ──
  const dragMode = tab === 'fläche' && fillMode === 'photo' && hasPhotoBox ? 'focal'
    : tab === 'schrift' ? 'text'
    : tab === 'grafik' && sel != null ? 'sticker' : null

  const frac = (e: { clientX: number; clientY: number }) => {
    const r = previewRef.current!.getBoundingClientRect()
    return { fx: clamp01((e.clientX - r.left) / r.width), fy: clamp01((e.clientY - r.top) / r.height) }
  }
  const onDown = (e: React.PointerEvent) => {
    if (!dragMode) return
    try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId) } catch { /* ignorieren */ }
    const { fx, fy } = frac(e)
    if (dragMode === 'text') {
      const px = fx * 1080, py = fy * 1350
      const lay = moveTarget === 'eyebrow' ? overlineLayer : sloganLayer
      drag.current = { mode: 'text', ox: px - (lay?.x ?? 60), oy: py - (lay?.y ?? 1040) }
    } else if (dragMode === 'sticker' && sel != null) {
      const st = stickers[sel] // Greif-Versatz in 0..1, damit der Sticker dort bleibt, wo man ihn anfasst
      drag.current = { mode: 'sticker', ox: fx - (st?.x ?? 0.5), oy: fy - (st?.y ?? 0.5) }
    } else drag.current = { mode: dragMode, ox: 0, oy: 0 }
    onMove(e)
  }
  // rAF-throttled: viele pointermove-Events → max. ein Update pro Frame (flüssig).
  const applyDrag = () => {
    dragRaf.current = 0
    const pt = dragPt.current
    if (!pt || !drag.current) return
    const { fx, fy } = pt
    if (drag.current.mode === 'focal') patch({ focal: { x: Number(fx.toFixed(3)), y: Number(fy.toFixed(3)) } })
    else if (drag.current.mode === 'text') {
      const nx = Math.round(Math.min(1020, Math.max(0, fx * 1080 - drag.current.ox)))
      const ny = Math.round(Math.min(1320, Math.max(0, fy * 1350 - drag.current.oy)))
      if (moveTarget === 'eyebrow') patch({ overlinePos: { x: nx, y: ny } })
      else patch({ textPos: { x: nx, y: ny } })
    } else if (drag.current.mode === 'sticker' && sel != null) {
      updateSticker(sel, { x: Number(clamp01(fx - drag.current.ox).toFixed(3)), y: Number(clamp01(fy - drag.current.oy).toFixed(3)) })
    }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    dragPt.current = frac(e)
    if (!dragRaf.current) dragRaf.current = requestAnimationFrame(applyDrag)
  }
  const onUp = () => {
    if (dragRaf.current) { cancelAnimationFrame(dragRaf.current); dragRaf.current = 0 }
    applyDrag() // End-Position sicher übernehmen
    drag.current = null
  }

  const save = () => startTransition(async () => { await saveFigmaCover(dest.id, JSON.stringify(choice)); setSaved(true) })
  const exportPng = async () => {
    const node = fullRef.current; if (!node) return
    setExporting(true); setExportErr('')
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
      const { toPng } = await import('html-to-image')
      const url = await toPng(node, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true })
      const a = document.createElement('a'); a.href = url; a.download = `${dest.id}-cover.png`; a.click()
    } catch { setExportErr('Export fehlgeschlagen – bei hochgeladenen Fotos kann der Browser das Bild blockieren. Platzhalter funktioniert immer.') }
    finally { setExporting(false) }
  }
  const reset = () => { setChoice({}); setSel(null); setSaved(false) }

  const dragHint = dragMode === 'focal' ? 'Auf das Bild ziehen, um den Ausschnitt zu verschieben.'
    : dragMode === 'text' ? `Im Bild ziehen, um ${moveTarget === 'eyebrow' ? 'die kleine Zeile (Eyebrow)' : 'den Slogan'} zu verschieben.`
    : dragMode === 'sticker' ? 'Die Grafik im Bild ziehen, um sie zu platzieren.' : ''

  return (
    <div className="cb-root">
      <style>{CB_CSS}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <a href={`/admin/ausflug/${dest.id}`} className="adm-btn ghost" style={{ padding: '6px 12px' }}>← Zurück</a>
        <div>
          <h1 className="adm-h1" style={{ fontSize: 22, margin: 0 }}>Cover gestalten</h1>
          <div className="hint">{dest.name}</div>
        </div>
      </div>

      <div className="cb-main">
        <div className="cb-preview">
          {/* ── Live-Vorschau ── */}
          <div ref={previewRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            style={{ width: '100%', position: 'relative', touchAction: 'none', cursor: dragMode ? 'grab' : 'default' }}>
        <MeasuredCover dest={merged} />
        {dragMode === 'focal' && choice.focal && (
          <div style={{ position: 'absolute', left: `${choice.focal.x * 100}%`, top: `${choice.focal.y * 100}%`, width: 22, height: 22, marginLeft: -11, marginTop: -11, border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,.45)', pointerEvents: 'none' }} />
        )}
        {tab === 'grafik' && stickers.map((st, i) => (
          <div key={i} style={{ position: 'absolute', left: `${st.x * 100}%`, top: `${st.y * 100}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: '50%', border: sel === i ? '2px solid var(--ink)' : '2px solid rgba(255,255,255,.9)', boxShadow: '0 0 0 1.5px rgba(0,0,0,.4)', pointerEvents: 'none' }} />
        ))}
      </div>
          {dragHint && <p className="hint" style={{ textAlign: 'center', marginTop: 8 }}>{dragHint}</p>}
        </div>{/* /cb-preview */}

        <div className="cb-controls">
      {/* ── Schicht-Tabs ── */}
      <div style={{ display: 'flex', gap: 2, margin: '16px 0 14px', borderBottom: '1px solid var(--line-soft)' }}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{ flex: 1, padding: '9px 2px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--ink)' : '2px solid transparent', fontWeight: tab === t ? 800 : 600, color: tab === t ? 'var(--ink)' : 'var(--ink-soft)', textTransform: 'capitalize', cursor: 'pointer', fontSize: 13.5 }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── VORLAGE ── */}
      {tab === 'vorlage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 1fr))', gap: 10 }}>
          {PICKER_TEMPLATES.map((t) => {
            const on = (choice.templateId ?? template.id) === t.id
            return (
              <button key={t.id} type="button" onClick={() => patch({ templateId: t.id })}
                style={{ padding: 0, border: on ? '2.5px solid var(--ink)' : '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'none', cursor: 'pointer' }}>
                <FigmaCover template={t} content={resolveFigmaCover({ ...dest, figmaCover: { templateId: t.id } }).content} width={86} />
                <div style={{ fontSize: 10.5, padding: '4px 2px', color: on ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: on ? 700 : 500, lineHeight: 1.15 }}>{t.name}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── FLÄCHE (Foto/Farbe · Rahmen · Scrim) ── */}
      {tab === 'fläche' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {hasPhotoBox && (
            <div style={{ display: 'flex', gap: 8 }}>
              {(['photo', 'color'] as const).map((m) => (
                <button key={m} type="button" onClick={() => patch({ fillMode: m })}
                  style={{ flex: 1, padding: '9px', borderRadius: 10, border: fillMode === m ? '2px solid var(--ink)' : '1px solid var(--line)', background: fillMode === m ? 'var(--ink)' : 'transparent', color: fillMode === m ? '#fff' : 'var(--ink)', fontWeight: 700, cursor: 'pointer' }}>
                  {m === 'photo' ? 'Foto' : 'Farbfläche'}
                </button>
              ))}
            </div>
          )}

          {fillMode === 'photo' && hasPhotoBox ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8 }}>
                {photoOptions.map((url) => (
                  <button key={url} type="button" onClick={() => patch({ photoUrl: url })}
                    style={{ padding: 0, border: content.photo === url ? '2.5px solid var(--ink)' : '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: 'none', cursor: 'pointer' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
              {isDemo && <p className="hint" style={{ marginTop: -6, fontStyle: 'italic' }}>Platzhalter – ein echtes Foto lädst du im Inhalts-Editor hoch.</p>}
              <div>
                <label className="hint" style={{ display: 'block', marginBottom: 4 }}>Zoom</label>
                <input type="range" min={1} max={2.5} step={0.05} value={choice.photoZoom ?? 1} className="slider"
                  onChange={(e) => patch({ photoZoom: Number(e.target.value) === 1 ? undefined : Number(e.target.value) })} style={{ width: '100%' }} />
              </div>
            </>
          ) : (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Farbe der Fläche</label>
              <Swatches value={choice.fillColor} onPick={(c) => patch({ fillColor: c, fillMode: 'color' })} first={{ label: 'Lila', bg: COVER_COLORS.purple }} />
            </div>
          )}

          {hasPhotoBox && (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Rahmen-Form</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {FRAME_SHAPES.map((f) => {
                  const on = (choice.frameShape ?? 'template') === f.id
                  return (
                    <button key={f.id} type="button" onClick={() => patch({ frameShape: f.id })}
                      style={{ padding: '6px 11px', borderRadius: 999, border: on ? '2px solid var(--ink)' : '1px solid var(--line)', background: on ? 'var(--ink)' : 'transparent', color: on ? '#fff' : 'var(--ink)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{f.label}</button>
                  )
                })}
              </div>
            </div>
          )}

          {hasPhotoBox && fillMode === 'photo' && (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 4 }}>Scrim (dunkler Verlauf für Lesbarkeit)</label>
              <input type="range" min={0} max={0.95} step={0.05}
                value={choice.scrim ?? (template.layers.find((l) => l.type === 'photo' && l.scrim) ? 0.88 : 0)} className="slider"
                onChange={(e) => { const v = Number(e.target.value); patch({ scrim: v <= 0 ? null : v }) }} style={{ width: '100%' }} />
            </div>
          )}
        </div>
      )}

      {/* ── SCHRIFT ── */}
      {tab === 'schrift' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="adm-field">
            <label>Slogan</label>
            <input type="text" value={choice.slogan ?? ''} placeholder={dest.teaser || 'Werbespruch fürs Bild'} onChange={(e) => patch({ slogan: e.target.value || undefined })} />
          </div>
          <div className="adm-field">
            <label>Eyebrow / Ort <span className="hint">(kleine Zeile)</span></label>
            <input type="text" value={choice.overline ?? ''} placeholder={dest.place || 'z. B. Oberstdorf'} onChange={(e) => patch({ overline: e.target.value || undefined })} />
          </div>
          {needsNumber(template) && (
            <div className="adm-field">
              <label>Große Zahl <span className="hint">(nur diese Vorlage)</span></label>
              <input type="text" value={choice.number ?? ''} placeholder="z. B. 5" onChange={(e) => patch({ number: e.target.value || undefined })} />
            </div>
          )}
          <label className="adm-publish" data-on={!!choice.textMarker} style={{ marginTop: 0 }}>
            <input type="checkbox" checked={!!choice.textMarker} onChange={(e) => patch({ textMarker: e.target.checked || undefined })} />
            <span className="dot" aria-hidden />
            <span><strong>Textmarker</strong><span className="hint" style={{ display: 'block' }}>Slogan auf farbigen Balken (wie Marker).</span></span>
          </label>
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 4 }}>Schriftgröße</label>
            <input type="range" min={0.6} max={1.5} step={0.05} value={choice.fontScale ?? 1} className="slider"
              onChange={(e) => patch({ fontScale: Number(e.target.value) === 1 ? undefined : Number(e.target.value) })} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Schriftfarbe</label>
            <Swatches value={choice.sloganColor} onPick={(c) => patch({ sloganColor: c })} first={{ label: 'Automatisch', bg: 'conic-gradient(#ffa3eb,#ffdd00,#8583e4,#ff932f,#ffa3eb)' }} />
          </div>
          {!choice.textMarker && (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Farbbalken hinter dem Slogan</label>
              <Swatches value={choice.textBar ?? undefined} onPick={(c) => patch({ textBar: c ?? null })} first={{ label: 'Keiner', bg: 'repeating-linear-gradient(45deg,#fff,#fff 4px,#eee 4px,#eee 8px)' }} />
            </div>
          )}
          {hasMarkerOrBand && (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Marker-/Bandarolen-Farbe</label>
              <Swatches value={choice.barColor} onPick={(c) => patch({ barColor: c })} first={{ label: 'Wie Vorlage', bg: 'conic-gradient(#8583e4,#ff932f,#ffdd00,#8583e4)' }} />
            </div>
          )}
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Verschieben <span>(dann im Bild ziehen)</span></label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {(['title', 'eyebrow'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMoveTarget(m)}
                  style={{ padding: '7px 14px', borderRadius: 999, border: moveTarget === m ? '2px solid var(--ink)' : '1px solid var(--line)', background: moveTarget === m ? 'var(--ink)' : 'transparent', color: moveTarget === m ? '#fff' : 'var(--ink)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  {m === 'title' ? 'Titel' : 'Eyebrow'}
                </button>
              ))}
              {(choice.textPos || choice.overlinePos) && <button type="button" className="adm-btn ghost" style={{ padding: '6px 12px' }} onClick={() => patch({ textPos: undefined, overlinePos: undefined })}>Position zurücksetzen</button>}
            </div>
          </div>
        </div>
      )}

      {/* ── GRAFIK (Brand-Sticker) ── */}
      {tab === 'grafik' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Grafik einfügen</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(58px, 1fr))', gap: 8 }}>
              {STICKER_GRAPHICS.map((g) => (
                <button key={g} type="button" onClick={() => addSticker(g)}
                  style={{ aspectRatio: '1', border: '1px solid var(--line)', borderRadius: 10, background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={graphicSrc(g)} alt={g} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </div>
          {stickers.length > 0 ? (
            <div>
              <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Platzierte Grafiken <span>(antippen zum Bearbeiten, im Bild ziehen)</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stickers.map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, border: sel === i ? '2px solid var(--ink)' : '1px solid var(--line)', background: '#fff' }}>
                    <button type="button" onClick={() => setSel(sel === i ? null : i)} style={{ width: 40, height: 40, flexShrink: 0, border: 'none', background: '#f3efe4', borderRadius: 8, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={graphicSrc(st.asset)} alt="" style={{ maxWidth: '78%', maxHeight: '78%' }} />
                    </button>
                    {sel === i ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label className="hint">Größe</label>
                        <input type="range" min={0.08} max={0.8} step={0.02} value={st.scale} className="slider" onChange={(e) => updateSticker(i, { scale: Number(e.target.value) })} />
                        <label className="hint">Drehung</label>
                        <input type="range" min={-180} max={180} step={5} value={st.rot ?? 0} className="slider" onChange={(e) => updateSticker(i, { rot: Number(e.target.value) || undefined })} />
                      </div>
                    ) : <span className="hint" style={{ flex: 1 }} onClick={() => setSel(i)}>{st.asset}</span>}
                    <button type="button" onClick={() => removeSticker(i)} className="adm-btn ghost" style={{ padding: '4px 10px', borderColor: '#b00020', color: '#b00020' }}>Entfernen</button>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="hint">Noch keine Grafik – oben eine auswählen, dann im Bild platzieren.</p>}
        </div>
      )}

      {/* ── STEMPEL ── */}
      {tab === 'stempel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="adm-publish" data-on={content.showStamp} style={{ marginTop: 0 }}>
            <input type="checkbox" checked={!!content.showStamp} onChange={(e) => patch({ showStamp: e.target.checked })} />
            <span className="dot" aria-hidden />
            <span><strong>Kategorie-Stempel {content.showStamp ? 'sichtbar' : 'aus'}</strong><span className="hint" style={{ display: 'block' }}>Oben rechts auf dem Cover.</span></span>
          </label>
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Welcher Stempel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 8 }}>
              {STAMP_CATEGORIES.map((cat) => {
                const on = content.stampCategory === cat
                return (
                  <button key={cat} type="button" onClick={() => patch({ stampCategory: cat, showStamp: true })} title={cat}
                    style={{ padding: 5, border: on ? '2.5px solid var(--ink)' : '1px solid var(--line)', borderRadius: 10, background: '#fff', cursor: 'pointer' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/cover/stamps/${cat}.png`} alt={cat} style={{ width: '100%', display: 'block', borderRadius: '50%' }} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
        </div>{/* /cb-controls */}
      </div>{/* /cb-main */}

      {/* ── Aktionsleiste (sticky) ── */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'var(--paper, #f7f2e5)', borderTop: '1px solid var(--line)', padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="adm-btn ghost" onClick={reset}>Auto</button>
        <button type="button" className="adm-btn ghost" onClick={exportPng} disabled={exporting}>{exporting ? 'Export…' : 'PNG ↓'}</button>
        <button type="button" className="adm-btn" onClick={save} disabled={pending}>{pending ? 'Speichert…' : saved ? 'Gespeichert ✓' : 'Speichern'}</button>
      </div>
      {exportErr && <p className="hint" style={{ color: '#b00020', textAlign: 'center', marginTop: 10 }}>{exportErr}</p>}

      {/* ── Verstecktes Vollformat fürs PNG (1080×1350) ── */}
      <div style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none', opacity: 0 }} aria-hidden>
        <div ref={fullRef}><FigmaCover template={template} content={content} width={1080} /></div>
      </div>
    </div>
  )
}
