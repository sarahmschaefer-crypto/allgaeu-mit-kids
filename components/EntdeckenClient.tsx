// components/EntdeckenClient.tsx
'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import LocationCard from '@/components/LocationCard'
import { locations, CATEGORIES, REGIONS, COST_LABEL } from '@/lib/locations'

// Map is client-only (Leaflet needs window)
const EntdeckenMap = dynamic(() => import('@/components/EntdeckenMap'), { ssr: false })

const AGE_GROUPS = ['0-3', '3-6', '6-12', '12+']

function EntdeckenInner() {
  const params = useSearchParams()

  const [view,        setView]        = useState<'liste' | 'karte'>('liste')
  const [category,    setCategory]    = useState<string>(params.get('category') ?? '')
  const [region,      setRegion]      = useState<string>('')
  const [cost,        setCost]        = useState<string>('')
  const [ageGroup,    setAgeGroup]    = useState<string>('')

  // Sync category from URL on mount
  useEffect(() => {
    const cat = params.get('category')
    if (cat) setCategory(cat)
    const v = params.get('view')
    if (v === 'karte') setView('karte')
  }, [params])

  const filtered = locations.filter(loc => {
    if (category && loc.category !== category) return false
    if (region   && loc.region   !== region)   return false
    if (cost     && loc.cost     !== cost)      return false
    if (ageGroup && !loc.ageGroups.includes(ageGroup)) return false
    return true
  })

  const hasFilters = !!(category || region || cost || ageGroup)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="mb-8 space-y-2">
        <p className="label">Ausflugsziele im Allgäu</p>
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-courier)' }}>
          {hasFilters ? `${filtered.length} Ergebnis${filtered.length !== 1 ? 'se' : ''}` : 'Alle Ausflugsziele'}
        </h1>
      </div>

      {/* Filter bar */}
      <div className="border-2 border-ink p-4 mb-8 space-y-4" style={{ boxShadow: '3px 3px 0 #1a1a1a' }}>

        {/* Category pills */}
        <div className="space-y-2">
          <p className="label text-ink/50">Kategorie</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border-2 border-ink transition-all ${
                !category ? 'bg-ink text-paper' : 'bg-transparent hover:bg-ink/5'
              }`}
              style={{ fontFamily: 'var(--font-source-code)', boxShadow: !category ? '2px 2px 0 #B49139' : '2px 2px 0 #1a1a1a' }}
            >
              Alle
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setCategory(category === cat.name ? '' : cat.name)}
                className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border-2 border-ink transition-all"
                style={{
                  fontFamily: 'var(--font-source-code)',
                  backgroundColor: category === cat.name ? cat.color : 'transparent',
                  color: category === cat.name ? '#F5EFE8' : '#1a1a1a',
                  boxShadow: '2px 2px 0 #1a1a1a',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Second row: region, cost, age */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-dashed border-ink/30">
          {/* Region */}
          <div className="space-y-1">
            <p className="label text-ink/50 text-[9px]">Region</p>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold"
              style={{ fontFamily: 'var(--font-source-code)', boxShadow: '2px 2px 0 #1a1a1a' }}
            >
              <option value="">Alle Regionen</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Cost */}
          <div className="space-y-1">
            <p className="label text-ink/50 text-[9px]">Kosten</p>
            <select
              value={cost}
              onChange={e => setCost(e.target.value)}
              className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold"
              style={{ fontFamily: 'var(--font-source-code)', boxShadow: '2px 2px 0 #1a1a1a' }}
            >
              <option value="">Alle</option>
              {Object.entries(COST_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <p className="label text-ink/50 text-[9px]">Altersgruppe</p>
            <select
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value)}
              className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold"
              style={{ fontFamily: 'var(--font-source-code)', boxShadow: '2px 2px 0 #1a1a1a' }}
            >
              <option value="">Alle Altersgruppen</option>
              {AGE_GROUPS.map(a => <option key={a} value={a}>{a} Jahre</option>)}
            </select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <div className="space-y-1">
              <p className="label text-ink/50 text-[9px]">&nbsp;</p>
              <button
                onClick={() => { setCategory(''); setRegion(''); setCost(''); setAgeGroup('') }}
                className="lofi-btn lofi-btn-outline py-1.5 text-[10px]"
              >
                × Filter löschen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 mb-6">
        {(['liste', 'karte'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="label px-4 py-2 border-2 border-ink transition-all"
            style={{
              backgroundColor: view === v ? '#1a1a1a' : 'transparent',
              color: view === v ? '#F5EFE8' : '#1a1a1a',
              boxShadow: view === v ? '2px 2px 0 #B49139' : '2px 2px 0 #1a1a1a',
            }}
          >
            {v === 'liste' ? '☰ Liste' : '⊕ Karte'}
          </button>
        ))}
        <span className="ml-auto label text-ink/40">
          {filtered.length} Ziel{filtered.length !== 1 ? 'e' : ''}
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-ink/30">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="label text-ink/40">Keine Ausflugsziele gefunden</p>
          <button
            onClick={() => { setCategory(''); setRegion(''); setCost(''); setAgeGroup('') }}
            className="lofi-btn lofi-btn-outline mt-6"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : view === 'liste' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(loc => <LocationCard key={loc.id} loc={loc} />)}
        </div>
      ) : (
        <EntdeckenMap locations={filtered} />
      )}

    </div>
  )
}

// Suspense boundary required for useSearchParams in Next.js 15
export default function EntdeckenClient() {
  return (
    <Suspense>
      <EntdeckenInner />
    </Suspense>
  )
}
