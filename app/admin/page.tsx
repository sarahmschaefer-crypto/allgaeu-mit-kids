// app/admin/page.tsx — Übersicht aller Ausflugsziele (Server-Component).
import Link from 'next/link'
import { getAllDests } from '@/lib/content/store'
import { DestPreview } from '@/components/content/DestPreview'

export const dynamic = 'force-dynamic' // Phase 1: immer frisch aus dem Datei-Store

export default async function AdminHome() {
  const dests = await getAllDests()
  const live = dests.filter((d) => d.published).length
  return (
    <>
      <h1 className="adm-h1">Ausflugsziele</h1>
      <p className="adm-lead">
        {dests.length} Ziele · {live} veröffentlicht · {dests.length - live} Entwürfe. Vorschaubild = das Cover. Tippe auf ein Ziel zum Bearbeiten.
      </p>
      <div className="adm-grid">
        {dests.map((d) => (
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
