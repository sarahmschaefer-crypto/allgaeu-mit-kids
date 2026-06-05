// app/karte/page.tsx — Karte is now a view of /entdecken. Keep the old URL
// working by redirecting to the map view.
import { redirect } from 'next/navigation'

export default function KartePage() {
  redirect('/entdecken?view=karte')
}
