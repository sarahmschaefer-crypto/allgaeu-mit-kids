'use client'
// app/admin/ausflug/[id]/cover/CoverEditor.tsx — Instagram-artiger, mobile-first
// Cover-Builder. Schicht-Tabs (Vorlage · Foto · Text · Stempel), Live-Vorschau,
// Foto-Fokus per Ziehen, Größen-/Farb-Regler, Speichern + PNG-Export.
import { useEffect, useMemo, useRef, useState, useTransition, type CSSProperties } from 'react'
import { FigmaCover } from '@/components/cover/FigmaCover'
import { COVER_COLORS, type CoverColor } from '@/lib/cover/types'
import { resolveFigmaCover, PICKER_TEMPLATES, DEMO_PHOTOS, needsNumber } from '@/lib/content/figma-cover'
import type { ContentDest, FigmaCoverChoice } from '@/lib/content/types'
import { saveFigmaCover } from '@/app/admin/actions'

const SWATCHES: (CoverColor | 'white')[] = ['white', 'ink', 'pink', 'yellow', 'purple', 'orange']
const swatchHex = (c: CoverColor | 'white') => (c === 'white' ? '#ffffff' : COVER_COLORS[c])

// Rendert FigmaCover auf die gemessene Containerbreite (FigmaCover braucht eine Zahl).
function MeasuredCover({ dest, style }: { dest: ContentDest; style?: CSSProperties }) {
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
    <div ref={ref} style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 14, background: '#e9e4d8', ...style }}>
      {w > 0 && <FigmaCover template={template} content={content} width={w} />}
    </div>
  )
}

type Tab = 'vorlage' | 'foto' | 'text' | 'stempel'

export function CoverEditor({ dest }: { dest: ContentDest }) {
  const [choice, setChoice] = useState<FigmaCoverChoice>(dest.figmaCover ?? {})
  const [tab, setTab] = useState<Tab>('vorlage')
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportErr, setExportErr] = useState('')
  const [pending, startTransition] = useTransition()
  const fullRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const patch = (p: Partial<FigmaCoverChoice>) => { setChoice((c) => ({ ...c, ...p })); setSaved(false) }

  // Effektives Cover (Auswahl über Defaults gelegt).
  const merged = useMemo<ContentDest>(() => ({ ...dest, figmaCover: choice }), [dest, choice])
  const { template, content } = useMemo(() => resolveFigmaCover(merged), [merged])

  const photoOptions = useMemo(() => {
    const real = (dest.photos ?? []).map((p) => p.url)
    return [...real, ...DEMO_PHOTOS]
  }, [dest.photos])
  const isDemo = (content.photo ?? '').includes('/cover/demo/')

  // ── Foto-Fokus per Ziehen auf der Vorschau ──
  const setFocalFromEvent = (e: { clientX: number; clientY: number }) => {
    const el = previewRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    patch({ focal: { x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) } })
  }

  const save = () => startTransition(async () => {
    await saveFigmaCover(dest.id, JSON.stringify(choice))
    setSaved(true)
  })

  const exportPng = async () => {
    const node = fullRef.current; if (!node) return
    setExporting(true); setExportErr('')
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
      const { toPng } = await import('html-to-image')
      const url = await toPng(node, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true })
      const a = document.createElement('a')
      a.href = url; a.download = `${dest.id}-cover.png`; a.click()
    } catch {
      setExportErr('Export fehlgeschlagen – bei hochgeladenen Fotos kann der Browser das Bild blockieren. Demo-Fotos funktionieren immer.')
    } finally {
      setExporting(false)
    }
  }

  const reset = () => { setChoice({}); setSaved(false) }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '14px 14px 130px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <a href={`/admin/ausflug/${dest.id}`} className="adm-btn ghost" style={{ padding: '6px 12px' }}>← Zurück</a>
        <div>
          <h1 className="adm-h1" style={{ fontSize: 22, margin: 0 }}>Cover gestalten</h1>
          <div className="hint">{dest.name}</div>
        </div>
      </div>

      {/* ── Live-Vorschau (mit Foto-Fokus-Ziehen) ── */}
      <div
        ref={previewRef}
        onPointerDown={(e) => { if (tab === 'foto') { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setFocalFromEvent(e) } }}
        onPointerMove={(e) => { if (dragging.current) setFocalFromEvent(e) }}
        onPointerUp={() => { dragging.current = false }}
        style={{ width: 'min(78vw, 340px)', margin: '0 auto', position: 'relative', touchAction: 'none', cursor: tab === 'foto' ? 'grab' : 'default' }}
      >
        <MeasuredCover dest={merged} />
        {tab === 'foto' && choice.focal && (
          <div style={{ position: 'absolute', left: `${choice.focal.x * 100}%`, top: `${choice.focal.y * 100}%`, width: 22, height: 22, marginLeft: -11, marginTop: -11, border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,.45)', pointerEvents: 'none' }} />
        )}
      </div>
      {tab === 'foto' && <p className="hint" style={{ textAlign: 'center', marginTop: 8 }}>Auf das Bild ziehen, um den Ausschnitt zu verschieben.</p>}

      {/* ── Schicht-Tabs ── */}
      <div className="cb-tabs" style={{ display: 'flex', gap: 6, margin: '18px 0 14px', borderBottom: '1px solid var(--line-soft)' }}>
        {(['vorlage', 'foto', 'text', 'stempel'] as Tab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} data-on={tab === t}
            style={{ flex: 1, padding: '9px 4px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--ink)' : '2px solid transparent', fontWeight: tab === t ? 800 : 600, color: tab === t ? 'var(--ink)' : 'var(--ink-soft)', textTransform: 'capitalize', cursor: 'pointer', fontSize: 14 }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── VORLAGE ── */}
      {tab === 'vorlage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 1fr))', gap: 10 }}>
          {PICKER_TEMPLATES.map((t) => {
            const on = template.id === t.id
            return (
              <button key={t.id} type="button" onClick={() => patch({ templateId: t.id })}
                style={{ padding: 0, border: on ? '2.5px solid var(--ink)' : '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'none', cursor: 'pointer' }}>
                <FigmaCover template={t} content={resolveFigmaCover({ ...dest, figmaCover: { ...choice, templateId: t.id } }).content} width={86} />
                <div style={{ fontSize: 10.5, padding: '4px 2px', color: on ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: on ? 700 : 500, lineHeight: 1.15 }}>{t.name}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── FOTO ── */}
      {tab === 'foto' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 8, marginBottom: 16 }}>
            {photoOptions.map((url) => {
              const on = content.photo === url
              return (
                <button key={url} type="button" onClick={() => patch({ photoUrl: url })}
                  style={{ padding: 0, border: on ? '2.5px solid var(--ink)' : '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: 'none', cursor: 'pointer' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              )
            })}
          </div>
          {isDemo && <p className="hint" style={{ marginTop: -8, marginBottom: 14, fontStyle: 'italic' }}>Demo-Platzhalter – ein echtes Foto lädst du im Inhalts-Editor hoch.</p>}
          <label className="hint" style={{ display: 'block', marginBottom: 4 }}>Zoom</label>
          <input type="range" min={1} max={2.5} step={0.05} value={choice.photoZoom ?? 1} className="slider"
            onChange={(e) => patch({ photoZoom: Number(e.target.value) === 1 ? undefined : Number(e.target.value) })} style={{ width: '100%', marginBottom: 6 }} />
          <button type="button" className="adm-btn ghost" style={{ padding: '6px 12px' }} onClick={() => patch({ focal: undefined, photoZoom: undefined })}>Ausschnitt zurücksetzen</button>
        </div>
      )}

      {/* ── TEXT ── */}
      {tab === 'text' && (
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
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 4 }}>Schriftgröße</label>
            <input type="range" min={0.6} max={1.5} step={0.05} value={choice.fontScale ?? 1} className="slider"
              onChange={(e) => patch({ fontScale: Number(e.target.value) === 1 ? undefined : Number(e.target.value) })} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="hint" style={{ display: 'block', marginBottom: 6 }}>Schriftfarbe</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" onClick={() => patch({ sloganColor: undefined })} title="Automatisch"
                style={{ width: 30, height: 30, borderRadius: '50%', border: !choice.sloganColor ? '2.5px solid var(--ink)' : '1px solid var(--line)', background: 'conic-gradient(#ffa3eb,#ffdd00,#8583e4,#ff932f,#ffa3eb)', cursor: 'pointer' }} />
              {SWATCHES.map((c) => (
                <button key={c} type="button" onClick={() => patch({ sloganColor: c })} title={c}
                  style={{ width: 30, height: 30, borderRadius: '50%', border: choice.sloganColor === c ? '2.5px solid var(--ink)' : '1px solid var(--line)', background: swatchHex(c), cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEMPEL ── */}
      {tab === 'stempel' && (
        <div>
          <label className="adm-publish" data-on={content.showStamp} style={{ marginTop: 0 }}>
            <input type="checkbox" checked={!!content.showStamp} onChange={(e) => patch({ showStamp: e.target.checked })} />
            <span className="dot" aria-hidden />
            <span>
              <strong>Kategorie-Stempel {content.showStamp ? 'sichtbar' : 'aus'}</strong>
              <span className="hint" style={{ display: 'block' }}>Kategorie „{content.stampCategory}" – oben rechts auf dem Cover.</span>
            </span>
          </label>
        </div>
      )}

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
