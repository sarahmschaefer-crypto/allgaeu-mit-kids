// app/entdecken/page.tsx — unified Entdecken (Liste ⇄ Karte) on the shared
// dataset. Initial filter state can come from the URL (Quiz handoff).
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { ExploreView } from '@/components/shapes/ExploreView'
import { EMPTY_SEL, type SelState } from '@/lib/shapes/explore'

export const metadata: Metadata = {
  title: 'Ausflugsziele entdecken',
  description: 'Alle Ausflugsziele im Allgäu für Familien – als Liste oder auf der Karte, gefiltert nach Alter, Aktivität, Zeit und Budget.',
}

const AGE_IDS = ['0-2', '3-5', '6-9', '10+']
const TIME_IDS = ['kurz', 'halb', 'ganz']
const BUDGET_IDS = ['frei', '€', '€€', '€€€']
const TYPE_IDS = ['ausflug', 'schwimmen', 'spielplatz', 'tierpark', 'sport', 'attraktion', 'kultur', 'kreatives', 'gastro']
const ACCESS_IDS = ['kinderwagen', 'laufrad', 'fahrrad']
const WEATHER_IDS = ['gut', 'regen', 'schnee']
const SETTING_IDS = ['indoor', 'outdoor']
const REGION_IDS = ['westallgaeu', 'ostallgaeu', 'oberallgaeu', 'unterallgaeu', 'bodensee', 'oberschwaben', 'anderswo']
const pick = (v: string | undefined, allowed: string[]): string | null => (v && allowed.includes(v) ? v : null)

function list(v: string | undefined, allowed: string[]): string[] {
  if (!v) return []
  return v.split(',').filter((x) => allowed.includes(x))
}

type SP = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function EntdeckenPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const initialSel: SelState = {
    ...EMPTY_SEL,
    ages: list(one(sp.ages), AGE_IDS),
    times: list(one(sp.times), TIME_IDS),
    budgets: list(one(sp.budgets), BUDGET_IDS),
    types: list(one(sp.types), TYPE_IDS),
    weather: pick(one(sp.weather), WEATHER_IDS),
    setting: pick(one(sp.setting), SETTING_IDS),
    region: pick(one(sp.region), REGION_IDS),
    stroller: one(sp.stroller) === '1',
    parking: one(sp.parking) === '1',
    access: list(one(sp.access), ACCESS_IDS),
    ort: one(sp.ort) ?? '',
    radius: (() => {
      const r = Number(one(sp.radius))
      return Number.isFinite(r) && r > 0 ? Math.min(Math.max(r, 5), 80) : EMPTY_SEL.radius
    })(),
  }
  const initialView = one(sp.view) === 'karte' ? 'karte' : 'liste'
  const fromQuiz = one(sp.from) === 'quiz'

  return (
    <div className="shapes-root">
      <ShapesBar active="entdecken" />
      <main>
        <ExploreView initialSel={initialSel} initialView={initialView} fromQuiz={fromQuiz} />
      </main>
    </div>
  )
}
