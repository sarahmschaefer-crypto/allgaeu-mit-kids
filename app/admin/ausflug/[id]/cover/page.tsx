// app/admin/ausflug/[id]/cover/page.tsx — der Cover-Builder eines Ziels.
import { notFound } from 'next/navigation'
import { getContentDest } from '@/lib/content/store'
import { CoverEditor } from './CoverEditor'

export const dynamic = 'force-dynamic'

export default async function CoverBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = await getContentDest(id)
  if (!dest) notFound()
  return <CoverEditor dest={dest} />
}
