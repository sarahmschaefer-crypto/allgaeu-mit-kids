'use server'
// app/admin/actions.ts — Server-Actions für den Editor.
// PHASE 1: schreibt in den Datei-Store + lokale Uploads. PHASE 2: Store→Postgres,
// Upload→Vercel Blob (nur die Implementierung wechselt, die Action-Signaturen bleiben).
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getContentDest, updateDest, deleteDest as storeDeleteDest, createDest as storeCreateDest } from '@/lib/content/store'
import type { ContentDest } from '@/lib/content/types'

// Legt ein neues (leeres) Ziel an und springt direkt in dessen Editor.
export async function createDest(formData: FormData): Promise<void> {
  const name = String(formData.get('name') || '').trim()
  const dest = await storeCreateDest(name || 'Neues Ausflugsziel')
  revalidatePath('/', 'layout') // Admin + öffentliche Seiten neu validieren
  redirect(`/admin/ausflug/${dest.id}`)
}

// Speichert die im Editor geänderten Felder (als JSON-Payload übergeben).
export async function saveDest(formData: FormData): Promise<void> {
  const id = String(formData.get('id') || '')
  if (!id) return
  let patch: Partial<ContentDest> = {}
  try {
    patch = JSON.parse(String(formData.get('payload') || '{}'))
  } catch {
    return
  }
  // id niemals aus dem Payload überschreiben.
  delete (patch as { id?: string }).id
  await updateDest(id, patch)
  // Admin + öffentliche Seiten (Landing/Entdecken/Detail) nach dem Speichern aktualisieren.
  revalidatePath('/', 'layout')
}

// Löscht ein Ziel und kehrt zur Liste zurück.
export async function deleteDest(formData: FormData): Promise<void> {
  const id = String(formData.get('id') || '')
  if (id) {
    await storeDeleteDest(id)
    revalidatePath('/', 'layout')
  }
  redirect('/admin')
}

// Lädt ein Foto hoch (lokal nach public/uploads) und hängt es ans Ziel.
export async function uploadPhoto(formData: FormData): Promise<void> {
  const id = String(formData.get('id') || '')
  const file = formData.get('photo') as File | null
  if (!id || !file || file.size === 0) return

  const buf = Buffer.from(await file.arrayBuffer())
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const fname = `${id}-${Date.now()}.${ext}`

  // Env-gesteuert: Vercel Blob (Cloud) wenn Token gesetzt, sonst lokal nach public/uploads.
  let url: string
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(`uploads/${fname}`, buf, { access: 'public', contentType: file.type || undefined })
    url = blob.url
  } else {
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, fname), buf)
    url = `/uploads/${fname}`
  }

  const dest = await getContentDest(id)
  const photos = [...(dest?.photos ?? []), { url }]
  await updateDest(id, { photos })
  revalidatePath('/', 'layout')
}
