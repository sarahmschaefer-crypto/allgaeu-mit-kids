// app/swipe/page.tsx — the playful discovery mode is now the Sammelalbum.
// Keep the old URL working by redirecting.
import { redirect } from 'next/navigation'

export default function SwipePage() {
  redirect('/sammeln')
}
