'use client'
// components/story/MatchContext.tsx — shared landing state. The embedded quiz
// (section 2) writes the selection; the gallery (section 3) reads `matches`.
import { createContext, useContext, useMemo, useState } from 'react'
import { filterDests, type ShapesDest, type Sel } from '@/lib/shapes/data'

export type ArrField = 'ages' | 'types' | 'times' | 'budgets'
export type MatchSel = { ages: string[]; types: string[]; times: string[]; budgets: string[]; weather: string | null }
const DEFAULT: MatchSel = { ages: [], types: [], times: [], budgets: [], weather: null }

type Ctx = {
  sel: MatchSel
  toggle: (field: ArrField, id: string) => void
  setWeather: (id: string | null) => void
  reset: () => void
  matches: ShapesDest[]
}
const MatchCtx = createContext<Ctx | null>(null)

export function useMatch(): Ctx {
  const c = useContext(MatchCtx)
  if (!c) throw new Error('useMatch must be used inside <MatchProvider>')
  return c
}

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [sel, setSel] = useState<MatchSel>(DEFAULT)

  const toggle = (field: ArrField, id: string) =>
    setSel((s) => ({ ...s, [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] }))
  const setWeather = (id: string | null) => setSel((s) => ({ ...s, weather: s.weather === id ? null : id }))
  const reset = () => setSel(DEFAULT)

  const matches = useMemo(() => filterDests(sel as Sel), [sel])

  return <MatchCtx.Provider value={{ sel, toggle, setWeather, reset, matches }}>{children}</MatchCtx.Provider>
}
