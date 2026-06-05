'use client'
// components/shapes/ExploreView.tsx — unified "Entdecken": one filter sidebar
// driving two synced views (Liste ⇄ Karte). Replaces the separate FilterBrowse
// + MapExplore. Initial state comes from the URL (so the Quiz can hand off its
// answers as pre-applied filters).
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import {
  AGES,
  TIMES,
  BUDGETS,
  CATEGORIES,
  filterDests,
  matchScore,
  getDest,
  type Sel,
  type ShapesDest,
} from '@/lib/shapes/data'
import { EMPTY_SEL, type SelState } from '@/lib/shapes/explore'
import { DestCard, Container, Photo, CatPill, Stars } from '@/components/shapes/primitives'
import { Squiggle } from '@/components/shapes/decor'

type FacetItem = { id: string; label: string }

function FacetGroup({ title, items, sel, onToggle, first }: { title: string; items: FacetItem[]; sel: string[]; onToggle: (id: string) => void; first?: boolean }) {
  return (
    <div style={{ paddingTop: first ? 0 : 20, marginTop: first ? 0 : 20, borderTop: first ? 'none' : '1px solid var(--line-soft)' }}>
      <div className="kicker" style={{ marginBottom: 13 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((it) => (
          <button key={it.id} className="chip" data-on={sel.includes(it.id)} onClick={() => onToggle(it.id)}>
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CategoryFacet({ sel, onToggle }: { sel: string[]; onToggle: (id: string) => void }) {
  return (
    <div style={{ paddingTop: 20, marginTop: 20, borderTop: '1px solid var(--line-soft)' }}>
      <div className="kicker" style={{ marginBottom: 13 }}>Worauf habt ihr Lust?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {Object.values(CATEGORIES).map((c) => (
          <button key={c.id} className="chip" data-on={sel.includes(c.id)} onClick={() => onToggle(c.id)}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: `var(--c-${c.id})`, flex: '0 0 auto' }} />
            {c.short}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({ label, sub, on, onClick }: { label: string; sub?: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '9px 0', cursor: 'pointer' }}>
      <span style={{ width: 42, height: 24, borderRadius: 999, background: on ? 'var(--accent)' : 'transparent', border: on ? 'none' : '1.5px solid var(--line)', position: 'relative', transition: 'all .18s', flex: '0 0 auto' }}>
        <span style={{ position: 'absolute', top: on ? 3 : 2.5, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: on ? '#fff' : 'var(--ink-faint)', transition: 'left .18s' }} />
      </span>
      <span>
        <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink-faint)' }}>{sub}</span>}
      </span>
    </button>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--ink-soft)' }}>
      <div style={{ display: 'inline-block', marginBottom: 14 }}>
        <Squiggle color="var(--accent)" width={120} height={36} humps={4} />
      </div>
      <h3 style={{ fontSize: 26 }}>Keine Treffer</h3>
      <p className="caption" style={{ maxWidth: 380, margin: '8px auto 20px', fontSize: 16 }}>
        Mit dieser Kombination haben wir leider nichts gefunden. Lockere ein paar Filter.
      </p>
      <button className="btn btn--ghost" onClick={onReset}>Filter zurücksetzen</button>
    </div>
  )
}

// ── Map panel (driven by the same filtered results) ───────────────────────────
function MapPin({ dest, active, hovered, onClick, onHover }: { dest: ShapesDest; active: boolean; hovered: boolean; onClick: () => void; onHover: (id: string | null) => void }) {
  const big = active || hovered
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(dest.id)}
      onMouseLeave={() => onHover(null)}
      style={{ position: 'absolute', left: dest.map.x + '%', top: dest.map.y + '%', transform: `translate(-50%, -50%) scale(${big ? 1.25 : 1})`, transformOrigin: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: big ? 20 : 5, transition: 'transform .15s ease', filter: big ? 'drop-shadow(0 5px 9px rgba(40,30,90,.28))' : 'drop-shadow(0 2px 3px rgba(40,30,90,.2))' }}
      aria-label={dest.name}
    >
      <span style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', background: `var(--c-${dest.cat})`, border: '2.5px solid var(--bg)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bg)' }} />
      </span>
    </button>
  )
}

function MapPanel({ results }: { results: ShapesDest[] }) {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const activeDest = active ? getDest(active) : null
  const open = (id: string) => router.push(`/ausflug/${id}`)

  return (
    <div className="map-layout" style={{ display: 'flex', gap: 26, alignItems: 'stretch' }}>
      <div
        style={{
          position: 'relative', flex: 1, minWidth: 0, height: 600, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--ink)',
          background: `
            radial-gradient(circle at 34% 41%, oklch(0.78 0.08 255 / 0.5) 0 4%, transparent 4.6%),
            radial-gradient(ellipse 7% 4% at 60% 80%, oklch(0.78 0.08 255 / 0.45) 0 60%, transparent 62%),
            radial-gradient(circle at 14% 46%, oklch(0.78 0.08 255 / 0.4) 0 2.4%, transparent 3%),
            linear-gradient(150deg, oklch(0.92 0.045 150) 0%, oklch(0.91 0.04 120) 45%, oklch(0.91 0.05 95) 100%)`,
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}>
          <path d="M0,72 L18,52 L30,66 L46,40 L60,60 L78,34 L100,58" fill="none" stroke="oklch(0.6 0.06 150)" strokeWidth="0.5" strokeDasharray="1.4 1.4" />
          <path d="M0,86 L22,70 L40,82 L58,66 L80,80 L100,70" fill="none" stroke="oklch(0.6 0.06 150)" strokeWidth="0.5" strokeDasharray="1.4 1.4" />
        </svg>
        <span style={{ position: 'absolute', left: 18, top: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.1em', color: 'oklch(0.42 0.05 150)', textTransform: 'uppercase' }}>
          Stilisierte Karte · Allgäu
        </span>
        {results.map((d) => (
          <MapPin key={d.id} dest={d} active={active === d.id} hovered={hovered === d.id} onClick={() => setActive(d.id)} onHover={setHovered} />
        ))}
        {activeDest && (
          <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, maxWidth: 380 }}>
            <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--ink)', overflow: 'hidden', display: 'flex', boxShadow: 'var(--shadow-lg)' }}>
              <Photo cat={activeDest.cat} style={{ width: 116, flex: '0 0 116px' }} rounded={false} seed={5} />
              <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <CatPill cat={activeDest.cat} />
                  <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', fontSize: 20, lineHeight: 1.3, padding: 0 }} aria-label="Schließen">×</button>
                </div>
                <h3 style={{ fontSize: 20, margin: '9px 0 2px' }}>{activeDest.name}</h3>
                <div className="caption" style={{ fontSize: 14, marginBottom: 12 }}>{activeDest.place} · {activeDest.duration}</div>
                <button className="link-arrow" style={{ fontSize: 13 }} onClick={() => open(activeDest.id)}>Details ansehen <span>→</span></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="map-list" style={{ width: 320, flex: '0 0 320px', display: 'flex', flexDirection: 'column', maxHeight: 600, overflowY: 'auto', borderTop: '1px solid var(--ink)' }}>
        {results.length === 0 && <p className="caption" style={{ padding: '18px 6px', fontSize: 15 }}>Keine Orte mit diesen Filtern.</p>}
        {results.map((d) => (
          <button key={d.id} onClick={() => open(d.id)} onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)} style={{ display: 'flex', gap: 14, textAlign: 'left', background: hovered === d.id ? 'var(--bg-2)' : 'transparent', border: 'none', borderBottom: '1px solid var(--line-soft)', padding: '13px 6px', cursor: 'pointer', transition: 'background .12s, padding-left .15s', alignItems: 'center', paddingLeft: hovered === d.id ? 14 : 6 }}>
            <Photo cat={d.cat} style={{ width: 54, height: 54, borderRadius: 'var(--radius-sm)', flex: '0 0 54px' }} seed={d.name.length} />
            <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <CatPill cat={d.cat} />
                <Stars rating={d.rating} />
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{d.name}</span>
              <span className="caption" style={{ fontSize: 13.5 }}>{d.place}</span>
            </span>
          </button>
        ))}
      </div>
      <style>{`@media (max-width: 860px){ .map-layout{ flex-direction: column; } .map-list{ width:100% !important; flex-basis:auto !important; max-height:none !important; } }`}</style>
    </div>
  )
}

// ── Unified Explore ───────────────────────────────────────────────────────────
export function ExploreView({
  initialSel,
  initialView,
  fromQuiz,
}: {
  initialSel: SelState
  initialView: 'liste' | 'karte'
  fromQuiz: boolean
}) {
  const [sel, setSel] = useState<SelState>(initialSel)
  const [sort, setSort] = useState<'match' | 'rating' | 'name'>('match')
  const [view, setView] = useState<'liste' | 'karte'>(initialView)
  const [banner, setBanner] = useState(fromQuiz)

  const toggleIn = (key: 'ages' | 'times' | 'budgets' | 'cats' | 'types', id: string) =>
    setSel((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id] }))

  const active = sel.ages.length + sel.times.length + sel.budgets.length + sel.cats.length + sel.types.length + (sel.weather ? 1 : 0) + (sel.stroller ? 1 : 0)

  const ranked = filterDests(sel as Sel).map((d) => ({ d, m: matchScore(d, sel as Sel) }))
  if (sort === 'match') ranked.sort((a, b) => b.m - a.m || b.d.rating - a.d.rating)
  else if (sort === 'rating') ranked.sort((a, b) => b.d.rating - a.d.rating)
  else ranked.sort((a, b) => a.d.name.localeCompare(b.d.name, 'de'))
  const results = ranked.map((r) => r.d)

  const SegBtn = ({ v, children }: { v: 'liste' | 'karte'; children: React.ReactNode }) => (
    <button onClick={() => setView(v)} className={`view-seg${view === v ? ' on' : ''}`}>{children}</button>
  )

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 70 }} className="fade-in">
      {banner && (
        <div className="quiz-banner">
          <span>
            <strong>Basierend auf euren Antworten.</strong> Passt etwas nicht? Filter links einfach anpassen.
          </span>
          <button onClick={() => setBanner(false)} aria-label="Hinweis schließen">×</button>
        </div>
      )}
      <div className="filter-layout" style={{ display: 'flex', gap: 44, alignItems: 'flex-start' }}>
        <aside style={{ width: 268, flex: '0 0 268px' }}>
          <div style={{ position: 'sticky', top: 92 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: 26 }}>Filter</h3>
              {active > 0 && (
                <button className="link-arrow" style={{ fontSize: 12.5, borderBottomWidth: 1 } as CSSProperties} onClick={() => setSel(EMPTY_SEL)}>Zurücksetzen</button>
              )}
            </div>
            <hr className="rule" />
            <div style={{ marginTop: 20 }}>
              <FacetGroup title="Alter der Kinder" items={AGES} sel={sel.ages} onToggle={(id) => toggleIn('ages', id)} first />
              <CategoryFacet sel={sel.cats} onToggle={(id) => toggleIn('cats', id)} />
              <FacetGroup title="Verfügbare Zeit" items={TIMES} sel={sel.times} onToggle={(id) => toggleIn('times', id)} />
              <FacetGroup title="Budget" items={BUDGETS} sel={sel.budgets} onToggle={(id) => toggleIn('budgets', id)} />
            </div>
            <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 12, marginTop: 20 }}>
              <Toggle label="Auch bei Regen" sub="Nur wetterfeste Ziele" on={sel.weather === 'regen'} onClick={() => setSel((s) => ({ ...s, weather: s.weather === 'regen' ? null : 'regen' }))} />
              <Toggle label="Kinderwagentauglich" sub="Barrierearm & flach" on={sel.stroller} onClick={() => setSel((s) => ({ ...s, stroller: !s.stroller }))} />
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div className="kicker" style={{ marginBottom: 8 }}>{active > 0 ? 'Gefilterte Ergebnisse' : 'Alle Ausflugsziele'}</div>
              <h2 style={{ fontSize: 34, lineHeight: 1.3 }}>{results.length} {results.length === 1 ? 'Ziel' : 'Ziele'}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div className="view-toggle">
                <SegBtn v="liste">Liste</SegBtn>
                <SegBtn v="karte">Karte</SegBtn>
              </div>
              {view === 'liste' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                  Sortieren
                  <select value={sort} onChange={(e) => setSort(e.target.value as 'match' | 'rating' | 'name')} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', padding: '9px 22px 9px 2px', cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>
                    <option value="match">Beste Übereinstimmung</option>
                    <option value="rating">Bewertung</option>
                    <option value="name">Name (A–Z)</option>
                  </select>
                </label>
              )}
            </div>
          </div>
          <hr className="rule" style={{ marginBottom: 26 }} />
          {results.length === 0 ? (
            <EmptyState onReset={() => setSel(EMPTY_SEL)} />
          ) : view === 'karte' ? (
            <MapPanel results={results} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
              {ranked.map(({ d, m }) => (
                <DestCard key={d.id} dest={d} match={active > 0 ? m : undefined} />
              ))}
            </div>
          )}
        </main>
      </div>
      <style>{`@media (max-width: 820px){ .filter-layout{ flex-direction: column; } .filter-layout aside{ width:100% !important; flex-basis:auto !important; } .filter-layout aside > div{ position: static !important; } }`}</style>
    </Container>
  )
}
