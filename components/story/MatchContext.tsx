'use client'
// components/story/MatchContext.tsx — shared landing state so the Matcher and
// the "Das Allgäu öffnet sich" gallery speak about the SAME selection:
//   matches = hard-filtered set  → the Matcher's live count + list
//   ranked  = all places, best-fit first → the gallery sweep (always full)
import { createContext, useContext, useMemo, useState } from 'react'
import { filterDests, matchScore, DESTINATIONS, type ShapesDest } from '@/lib/shapes/data'

export type MatchSel = { ages: string[]; times: string[]; budgets: string[]; cats: string[] }
const DEFAULT: MatchSel = { ages: ['3-5'], times: ['halb'], budgets: [], cats: ['wasser'] }

type Ctx = {
  sel: MatchSel
  toggle: (field: keyof MatchSel, id: string) => void
  matches: ShapesDest[]
  ranked: ShapesDest[]
}
const MatchCtx = createContext<Ctx | null>(null)

export function useMatch(): Ctx {
  const c = useContext(MatchCtx)
  if (!c) throw new Error('useMatch must be used inside <MatchProvider>')
  return c
}

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [sel, setSel] = useState<MatchSel>(DEFAULT)
  const toggle = (field: keyof MatchSel, id: string) =>
    setSel((s) => ({ ...s, [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] }))

  const matches = useMemo(() => filterDests(sel), [sel])
  const ranked = useMemo(
    () =>
      DESTINATIONS.map((d) => ({ d, m: matchScore(d, sel) }))
        .sort((a, b) => b.m - a.m || b.d.rating - a.d.rating)
        .map((r) => r.d),
    [sel],
  )

  return <MatchCtx.Provider value={{ sel, toggle, matches, ranked }}>{children}</MatchCtx.Provider>
}
