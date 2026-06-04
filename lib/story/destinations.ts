// lib/story/destinations.ts — decorative data for the landing hero/journey.
// NOTE: the canonical destination dataset now lives in lib/shapes/data.ts.
// This file only keeps the journey-line palette + the "possibilities" that
// crop up along the animated path (purely visual, no real destinations).

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
