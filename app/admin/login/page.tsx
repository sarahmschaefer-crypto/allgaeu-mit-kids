// app/admin/login/page.tsx — Passwort-Login.
import { login } from './actions'

export const metadata = { title: 'Login', robots: { index: false, follow: false } }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const sp = await searchParams
  return (
    <div style={{ maxWidth: 380, margin: '10vh auto' }}>
      <h1 className="adm-h1">Redaktion</h1>
      <p className="adm-lead">Bitte melde dich an, um Inhalte zu bearbeiten.</p>
      <form action={login} className="adm-section">
        <input type="hidden" name="next" value={sp.next || '/admin'} />
        <div className="adm-field">
          <label htmlFor="pw">Passwort</label>
          <input id="pw" type="password" name="password" autoFocus required autoComplete="current-password" />
        </div>
        {sp.error ? (
          <p style={{ color: '#b00020', fontWeight: 700, marginTop: -4, marginBottom: 12 }}>Falsches Passwort.</p>
        ) : null}
        <button type="submit" className="adm-btn">Anmelden</button>
      </form>
    </div>
  )
}
