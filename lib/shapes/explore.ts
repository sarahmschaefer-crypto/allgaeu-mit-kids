// lib/shapes/explore.ts — shared filter-state shape + URL helper. Kept separate
// from the (client) ExploreView so server pages and other components can import
// these pure values without pulling in the whole view.
export type SelState = {
  ages: string[]
  times: string[]
  budgets: string[]
  types: string[]
  weather: string | null
  setting: string | null
  region: string | null
  stroller: boolean
  parking: boolean
  access: string[]
  ort: string
  radius: number
}

export const DEFAULT_RADIUS = 25

export const EMPTY_SEL: SelState = {
  ages: [],
  times: [],
  budgets: [],
  types: [],
  weather: null,
  setting: null,
  region: null,
  stroller: false,
  parking: false,
  access: [],
  ort: '',
  radius: DEFAULT_RADIUS,
}

// quiz/matcher answers (a partial selection) → /entdecken URL with pre-applied
// filters. Entdecken reads these back on the server.
export function buildExploreHref(sel: Partial<SelState>, opts?: { view?: 'liste' | 'karte'; from?: string }) {
  const p = new URLSearchParams()
  if (sel.ages?.length) p.set('ages', sel.ages.join(','))
  if (sel.times?.length) p.set('times', sel.times.join(','))
  if (sel.budgets?.length) p.set('budgets', sel.budgets.join(','))
  if (sel.types?.length) p.set('types', sel.types.join(','))
  if (sel.weather) p.set('weather', sel.weather)
  if (sel.setting) p.set('setting', sel.setting)
  if (sel.region) p.set('region', sel.region)
  if (sel.stroller) p.set('stroller', '1')
  if (sel.parking) p.set('parking', '1')
  if (sel.access?.length) p.set('access', sel.access.join(','))
  if (sel.ort?.trim()) p.set('ort', sel.ort.trim())
  if (sel.ort?.trim() && sel.radius && sel.radius !== DEFAULT_RADIUS) p.set('radius', String(sel.radius))
  if (opts?.view === 'karte') p.set('view', 'karte')
  if (opts?.from) p.set('from', opts.from)
  const qs = p.toString()
  return qs ? `/entdecken?${qs}` : '/entdecken'
}
