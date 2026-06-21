'use client'
// app/admin/AdminList.tsx — Ziel-Liste mit Suche + Live/Entwurf-Filter (Client).
import { useState } from 'react'
import Link from 'next/link'
import { DestPreview } from '@/components/content/DestPreview'
import type { ContentDest } from '@/lib/content/types'

type Filter = 'all' | 'live' | 'draft'

export function AdminList({ dests }: { dests: ContentDest[] }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const needle = q.trim().toLowerCase()
  const shown = dests.filter((d) => {
    if (filter === 'live' && !d.published) return false
    if (filter === 'draft' && d.published) return false
    if (needle) return d.name.toLowerCase().includes(needle) || d.place.toLowerCase().includes(needle)
    return true
  })

  return (
    <>
      <div className="adm-listbar">
        <input
          className="adm-search"
          type="search"
          placeholder="Suchen … (Name oder Ort)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="adm-seg" role="radiogroup" aria-label="Filter">
          {(['all', 'live', 'draft'] as Filter[]).map((f) => (
            <label key={f} data-on={filter === f}>
              <input type="radio" name="flt" checked={filter === f} onChange={() => setFilter(f)} />
              {f === 'all' ? 'Alle' : f === 'live' ? 'Live' : 'Entwürfe'}
            </label>
          ))}
        </div>
      </div>
      <p className="adm-lead" style={{ margin: '10px 0 16px' }}>{shown.length} angezeigt</p>
      <div className="adm-grid">
        {shown.map((d) => (
          <Link key={d.id} href={`/admin/ausflug/${d.id}`} className="adm-tile">
            <DestPreview spec={d.cover} radius={11} />
            <span className="adm-badge" data-live={d.published ? 'true' : 'false'}>
              {d.published ? 'Live' : 'Entwurf'}
            </span>
            <h3>{d.name}</h3>
            <span className="place">{d.place}</span>
            <span className="edit">Bearbeiten →</span>
          </Link>
        ))}
      </div>
    </>
  )
}
