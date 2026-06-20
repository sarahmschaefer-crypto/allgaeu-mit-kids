// lib/auth.ts — schlanker Passwort-Login für den Admin (Sarah + Schwester).
// Kein Klartext-Passwort im Cookie: gespeichert wird ein SHA-256-Token, das aus
// ADMIN_PASSWORD abgeleitet ist. Läuft in Edge-Middleware UND Node (Web Crypto).
export const ADMIN_COOKIE = 'amk_admin'

export async function adminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`amk-admin:v1:${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Erwartetes Cookie-Token aus der Env. Leer = nicht konfiguriert.
export async function expectedToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD
  return pw ? adminToken(pw) : null
}
