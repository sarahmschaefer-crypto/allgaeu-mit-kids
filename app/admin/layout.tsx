// app/admin/layout.tsx — Admin-Shell (Redaktionsbereich).
// Eigenes, gescoptes Styling (.adm). PHASE 2: hier kommt der Login-Gate davor.
import Link from 'next/link'
import { logout } from './login/actions'
import './admin.css'

export const metadata = {
  title: 'Redaktion',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <header className="adm-bar">
        <Link href="/admin" className="adm-brand">
          Allgäu mit Kids
          <small>Redaktion · Ausflugsziele</small>
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="adm-btn ghost" style={{ padding: '8px 14px', fontSize: 13 }}>
            Zur Website
          </Link>
          <form action={logout}>
            <button type="submit" className="adm-btn ghost" style={{ padding: '8px 14px', fontSize: 13 }}>
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="adm-wrap">{children}</main>
    </div>
  )
}
