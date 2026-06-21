// app/admin/page.tsx — Übersicht aller Ausflugsziele (Server-Component).
import { getAllDests } from '@/lib/content/store'
import { createDest } from './actions'
import { AdminList } from './AdminList'

export const dynamic = 'force-dynamic' // immer frisch aus dem Store

export default async function AdminHome() {
  const dests = await getAllDests()
  const live = dests.filter((d) => d.published).length
  return (
    <>
      <h1 className="adm-h1">Ausflugsziele</h1>
      <p className="adm-lead">
        {dests.length} Ziele · {live} veröffentlicht · {dests.length - live} Entwürfe. Vorschaubild = das Cover.
      </p>

      <form action={createDest} className="adm-create">
        <input name="name" type="text" placeholder="Name des neuen Ziels …" required />
        <button type="submit" className="adm-btn">+ Neues Ziel</button>
      </form>

      <AdminList dests={dests} />
    </>
  )
}
