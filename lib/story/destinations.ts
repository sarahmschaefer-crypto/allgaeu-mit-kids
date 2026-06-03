// lib/story/destinations.ts — landing-story content data (ported from data.jsx)

/* the segmented wavy-line palette (from the reference SVG) */
export const LINE_COLORS = ['#2C2A8E', '#BAA3FF', '#F7C125', '#FFA3EB', '#FF932F']

export type Possibility = {
  t: number
  label: string
  c: number
  big?: boolean
  sub?: string
}

/* possibilities cropping up along the journey path (t = fraction of length) */
export const POSSIBILITIES: Possibility[] = [
  { t: 0.05, label: 'Bergsee', c: 4 },
  { t: 0.14, label: 'Almhütte', c: 1, big: true, sub: 'Einkehr & Tiere' },
  { t: 0.23, label: 'Klamm', c: 0 },
  { t: 0.32, label: 'Barfußpfad', c: 2 },
  { t: 0.42, label: 'Sommerrodelbahn', c: 3, big: true, sub: 'Rasante Abfahrt' },
  { t: 0.52, label: 'Streichelhof', c: 1 },
  { t: 0.62, label: 'Wasserfall', c: 4 },
  { t: 0.71, label: 'Baumwipfelpfad', c: 2, big: true, sub: 'Über den Wipfeln' },
  { t: 0.81, label: 'Badestrand', c: 3 },
  { t: 0.91, label: 'Sennalpe', c: 0, big: true, sub: 'Käse & Kühe' },
]

export type Destination = {
  id: string
  name: string
  area: string
  ages: [number, number]
  time: 'kurz' | 'halb' | 'ganz'
  budget: number
  types: string[]
  img: string
  km: number
}

export const DESTINATIONS: Destination[] = [
  { id: 'alpsee', name: 'Alpsee Bergwelt', area: 'Immenstadt', ages: [4, 12], time: 'ganz', budget: 2, types: ['berg', 'abenteuer'], img: 'Bergstation & Coaster', km: 14 },
  { id: 'breitach', name: 'Breitachklamm', area: 'Oberstdorf', ages: [5, 12], time: 'halb', budget: 1, types: ['natur', 'wasser'], img: 'Steg über tosendem Wasser', km: 38 },
  { id: 'skywalk', name: 'Skywalk Allgäu', area: 'Scheidegg', ages: [3, 12], time: 'halb', budget: 2, types: ['natur', 'abenteuer'], img: 'Baumwipfelpfad im Nebelwald', km: 52 },
  { id: 'alpseebad', name: 'Großer Alpsee', area: 'Bühl', ages: [0, 12], time: 'halb', budget: 0, types: ['wasser', 'natur'], img: 'Flacher Badestrand am Bergsee', km: 16 },
  { id: 'sennalpe', name: 'Sennalpe & Streichelhof', area: 'Gunzesried', ages: [0, 8], time: 'halb', budget: 1, types: ['tiere', 'natur'], img: 'Kälber & Ziegen auf der Alm', km: 22 },
  { id: 'eistobel', name: 'Eistobel', area: 'Grünenbach', ages: [5, 12], time: 'halb', budget: 0, types: ['natur', 'wasser'], img: 'Wasserfälle im Tobel', km: 44 },
  { id: 'huendle', name: 'Sommerrodelbahn Hündle', area: 'Oberstaufen', ages: [4, 12], time: 'halb', budget: 2, types: ['berg', 'abenteuer'], img: 'Rodelbahn-Kurve am Hang', km: 28 },
  { id: 'kneipp', name: 'Kneipp-Wassertreten', area: 'Bad Wörishofen', ages: [1, 9], time: 'kurz', budget: 0, types: ['wasser', 'natur'], img: 'Wassertretbecken im Kurpark', km: 60 },
  { id: 'moor', name: 'Moor-Erlebnispfad', area: 'Bad Wurzach', ages: [3, 10], time: 'halb', budget: 0, types: ['natur'], img: 'Holzsteg durch das Moor', km: 70 },
  { id: 'museum', name: 'Bergbauernmuseum', area: 'Diepolz', ages: [3, 11], time: 'halb', budget: 1, types: ['tiere', 'regen'], img: 'Alter Hof mit Tieren', km: 20 },
  { id: 'aquaria', name: 'Erlebnisbad Aquaria', area: 'Oberstaufen', ages: [0, 12], time: 'halb', budget: 2, types: ['wasser', 'regen'], img: 'Rutsche im Hallenbad', km: 30 },
  { id: 'naturpfad', name: 'Naturerlebnispfad', area: 'Oberstdorf', ages: [2, 8], time: 'kurz', budget: 0, types: ['natur', 'abenteuer'], img: 'Barfußpfad & Spielstationen', km: 40 },
]

export const AGE_BANDS = [
  { id: 'a02', label: '0–2', range: [0, 2] as [number, number] },
  { id: 'a35', label: '3–5', range: [3, 5] as [number, number] },
  { id: 'a69', label: '6–9', range: [6, 9] as [number, number] },
  { id: 'a10', label: '10+', range: [10, 14] as [number, number] },
]

export const TIME_OPTS = [
  { id: 'kurz', label: 'Ein paar Stunden' },
  { id: 'halb', label: 'Halber Tag' },
  { id: 'ganz', label: 'Ganzer Tag' },
]
export const TIME_RANK: Record<string, number> = { kurz: 0, halb: 1, ganz: 2 }
export const BUDGET_OPTS = [
  { id: 0, label: 'Kostenlos' },
  { id: 1, label: 'Günstig' },
  { id: 2, label: 'Egal' },
]
export const TYPE_OPTS = [
  { id: 'natur', label: 'Natur' },
  { id: 'wasser', label: 'Wasser' },
  { id: 'tiere', label: 'Tiere' },
  { id: 'berg', label: 'Berg' },
  { id: 'abenteuer', label: 'Abenteuer' },
  { id: 'regen', label: 'Regenwetter' },
]

export type MatchQuery = {
  age?: string | null
  time?: string | null
  budget?: number | null
  types?: string[]
}

export function matchDestinations({ age, time, budget, types }: MatchQuery): Destination[] {
  return DESTINATIONS.filter((d) => {
    if (age) {
      const b = AGE_BANDS.find((x) => x.id === age)
      if (b && !(d.ages[0] <= b.range[1] && d.ages[1] >= b.range[0])) return false
    }
    if (time && TIME_RANK[d.time] > TIME_RANK[time]) return false
    if (budget !== null && budget !== undefined && d.budget > budget) return false
    if (types && types.length && !d.types.some((t) => types.includes(t))) return false
    return true
  })
}
