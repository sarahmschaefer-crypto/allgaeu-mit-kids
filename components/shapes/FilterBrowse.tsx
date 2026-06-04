'use client'
// components/shapes/FilterBrowse.tsx — editorial filter sidebar + results grid
// (ported from view_filter.jsx) on the unified Shapes dataset.
import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  AGES,
  TIMES,
  BUDGETS,
  TYPES,
  filterDests,
  matchScore,
  type Sel,
} from '@/lib/shapes/data'
import { DestCard, Container } from '@/components/shapes/primitives'
import { Squiggle } from '@/components/shapes/decor'

type FacetItem = { id: string; label: string; glyph?: string }

function FacetGroup({
  title,
  items,
  sel,
  onToggle,
  first,
}: {
  title: string
  items: FacetItem[]
  sel: string[]
  onToggle: (id: string) => void
  first?: boolean
}) {
  return (
    <div style={{ paddingTop: first ? 0 : 20, marginTop: first ? 0 : 20, borderTop: first ? 'none' : '1px solid var(--line-soft)' }}>
      <div className="kicker" style={{ marginBottom: 13 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((it) => (
          <button key={it.id} className="chip" data-on={sel.includes(it.id)} onClick={() => onToggle(it.id)}>
            {it.glyph && <span style={{ fontWeight: 800 }}>{it.glyph}</span>}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function TypeFacet({ sel, onToggle }: { sel: string[]; onToggle: (id: string) => void }) {
  return (
    <div style={{ paddingTop: 20, marginTop: 20, borderTop: '1px solid var(--line-soft)' }}>
      <div className="kicker" style={{ marginBottom: 13 }}>Aktivität</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {Object.values(TYPES).map((ty) => (
          <button key={ty.id} className="chip" data-on={sel.includes(ty.id)} onClick={() => onToggle(ty.id)}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: ty.color, flex: '0 0 auto' }} />
            {ty.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({
  label,
  sub,
  on,
  onClick,
}: {
  label: string
  sub?: string
  on: boolean
  onClick: () => void
}) {
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
      <button className="btn btn--ghost" onClick={onReset}>
        Filter zurücksetzen
      </button>
    </div>
  )
}

type SelState = {
  ages: string[]
  times: string[]
  budgets: string[]
  cats: string[]
  types: string[]
  weather: string | null
  stroller: boolean
}
const EMPTY_SEL: SelState = { ages: [], times: [], budgets: [], cats: [], types: [], weather: null, stroller: false }

export function FilterBrowse({ initialCats = [] }: { initialCats?: string[] }) {
  const [sel, setSel] = useState<SelState>({ ...EMPTY_SEL, cats: initialCats })
  const [sort, setSort] = useState<'match' | 'rating' | 'name'>('match')

  const toggleIn = (key: 'ages' | 'times' | 'budgets' | 'cats' | 'types', id: string) =>
    setSel((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id] }))

  const active =
    sel.ages.length + sel.times.length + sel.budgets.length + sel.cats.length + sel.types.length + (sel.weather ? 1 : 0) + (sel.stroller ? 1 : 0)

  const ranked = filterDests(sel as Sel).map((d) => ({ d, m: matchScore(d, sel as Sel) }))
  if (sort === 'match') ranked.sort((a, b) => b.m - a.m || b.d.rating - a.d.rating)
  else if (sort === 'rating') ranked.sort((a, b) => b.d.rating - a.d.rating)
  else ranked.sort((a, b) => a.d.name.localeCompare(b.d.name, 'de'))

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 70 }} className="fade-in">
      <div className="filter-layout" style={{ display: 'flex', gap: 44, alignItems: 'flex-start' }}>
        <aside style={{ width: 268, flex: '0 0 268px' }}>
          <div style={{ position: 'sticky', top: 92 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: 26 }}>Filter</h3>
              {active > 0 && (
                <button className="link-arrow" style={{ fontSize: 12.5, borderBottomWidth: 1 } as CSSProperties} onClick={() => setSel(EMPTY_SEL)}>
                  Zurücksetzen
                </button>
              )}
            </div>
            <hr className="rule" />
            <div style={{ marginTop: 20 }}>
              <FacetGroup title="Alter der Kinder" items={AGES} sel={sel.ages} onToggle={(id) => toggleIn('ages', id)} first />
              <TypeFacet sel={sel.types} onToggle={(id) => toggleIn('types', id)} />
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
              <h2 style={{ fontSize: 34, lineHeight: 1.3 }}>
                {ranked.length} {ranked.length === 1 ? 'Ziel' : 'Ziele'}
              </h2>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
              Sortieren
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'match' | 'rating' | 'name')}
                style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', padding: '9px 22px 9px 2px', cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}
              >
                <option value="match">Beste Übereinstimmung</option>
                <option value="rating">Bewertung</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </label>
          </div>
          <hr className="rule" style={{ marginBottom: 26 }} />
          {ranked.length === 0 ? (
            <EmptyState onReset={() => setSel(EMPTY_SEL)} />
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
