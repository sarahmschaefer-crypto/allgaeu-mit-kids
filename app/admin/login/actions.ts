'use server'
// app/admin/login/actions.ts — An-/Abmelden.
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, adminToken } from '@/lib/auth'

export async function login(formData: FormData) {
  const pw = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin')
  const expected = process.env.ADMIN_PASSWORD

  if (!expected || pw !== expected) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`)
  }

  const jar = await cookies()
  jar.set(ADMIN_COOKIE, await adminToken(pw), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  })
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
