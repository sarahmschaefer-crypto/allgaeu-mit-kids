// lib/shapes/explore.ts — shared filter-state shape + URL helper. Kept separate
// from the (client) ExploreView so server pages and other components can import
// these pure values without pulling in the whole view.
import { CATEGORIES } from './data'

export type SelState = {
  ages: string[]
  times: string[]
  budgets: string[]
  cats: string[]
  types: string[]
  weather: string | null
  stroller: boolean
}

export const EMPTY_SEL: SelState = {
  ages: [],
  times: [],
  budgets: [],
  cats: [],
  types: [],
  weather: null,
  stroller: false,
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES)

// quiz/matcher answers (a partial selection) → /entdecken URL with pre-applied
// filters. Entdecken reads these back on the server.
export function buildExploreHref(sel: Partial<SelState>, opts?: { view?: 'liste' | 'karte'; from?: string }) {
  const p = new URLSearchParams()
  if (sel.ages?.length) p.set('ages', sel.ages.join(','))
  if (sel.times?.length) p.set('times', sel.times.join(','))
  if (sel.budgets?.length) p.set('budgets', sel.budgets.join(','))
  if (sel.cats?.length) p.set('cats', sel.cats.join(','))
  if (sel.types?.length) p.set('types', sel.types.join(','))
  if (sel.weather) p.set('weather', sel.weather)
  if (sel.stroller) p.set('stroller', '1')
  if (opts?.view === 'karte') p.set('view', 'karte')
  if (opts?.from) p.set('from', opts.from)
  const qs = p.toString()
  return qs ? `/entdecken?${qs}` : '/entdecken'
}
