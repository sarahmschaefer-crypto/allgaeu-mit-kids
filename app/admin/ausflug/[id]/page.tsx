// app/admin/ausflug/[id]/page.tsx — Editor-Seite (lädt Ziel, rendert Client-Editor).
import { notFound } from 'next/navigation'
import { getContentDest } from '@/lib/content/store'
import { Editor } from './Editor'

export const dynamic = 'force-dynamic'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = await getContentDest(id)
  if (!dest) notFound()
  return <Editor dest={dest} />
}
