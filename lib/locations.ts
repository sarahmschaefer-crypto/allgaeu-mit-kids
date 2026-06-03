// lib/locations.ts

export type PathCondition = 'stroller' | 'bike' | 'balance-bike' | 'hiking'

export type Location = {
  id: number
  name: string
  subline: string
  region: string
  category: string
  cost: 'free' | 'cheap' | 'paid'
  priceDetail: string           // z.B. "Erwachsene 12 €, Kinder 6 €, unter 3 gratis"
  ageGroups: string[]
  duration: 'short' | 'half' | 'full'
  description: string
  address: string
  parking: string               // z.B. "Kostenloser Parkplatz 200 m entfernt"
  openingHours: string          // z.B. "Apr – Okt: täglich 9–17 Uhr"
  pathCondition: PathCondition[]
  lat: number
  lng: number
  images: string[]              // erstes Bild = Hero, rest = Galerie
}

export const CATEGORIES = [
  { name: 'Ausflug',    color: '#022D53' },
  { name: 'Baden',      color: '#00436C' },
  { name: 'Sport',      color: '#276299' },
  { name: 'Shop',       color: '#307A9A' },
  { name: 'Spielplatz', color: '#399CAA' },
  { name: 'Attraktion', color: '#399CAA' },
  { name: 'Gastro',     color: '#67C0C0' },
  { name: 'Tierpark',   color: '#88D3C1' },
  { name: 'Kreatives',  color: '#9CDEAF' },
  { name: 'Unterkunft', color: '#AADC93' },
  { name: 'Kultur',     color: '#B8CB6E' },
] as const

export const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c.color])
)

export const REGIONS = ['Oberallgäu', 'Unterallgäu', 'Westallgäu', 'Bodenseeregion', 'Vorarlberg']

export const PATH_CONDITION_LABEL: Record<PathCondition, string> = {
  stroller:      '🚼 Kinderwagentauglich',
  bike:          '🚲 Fahrradtauglich',
  'balance-bike':'🛴 Laufradtauglich',
  hiking:        '🥾 Wanderweg',
}

export const COST_LABEL: Record<string, string> = {
  free:  'Kostenlos',
  cheap: 'Günstig (< 10 €)',
  paid:  'Kostenpflichtig',
}

export const DURATION_LABEL: Record<string, string> = {
  short: 'Kurz (< 2h)',
  half:  'Halber Tag',
  full:  'Ganzer Tag',
}

export const locations: Location[] = [
  {
    id: 1,
    name: 'Alpspitzbahn Nesselwang',
    subline: 'Gondelbahn mit Gipfelspielplatz und Panoramablick',
    region: 'Oberallgäu',
    category: 'Ausflug',
    cost: 'paid',
    priceDetail: 'Erwachsene 16 €, Kinder (6–15 J.) 9 €, unter 6 gratis',
    ageGroups: ['6-12', '12+'],
    duration: 'half',
    description: 'Familienfreundliche Gondelbahn auf die Alpspitze mit traumhaftem Panoramablick auf die Allgäuer Alpen. Oben gibt es einen Spielplatz und einen Kletterturm direkt an der Bergstation. Bei klarem Wetter sieht man bis zum Bodensee. Der Weg zurück ins Tal kann auch zu Fuß gegangen werden – ideal für sportlichere Familien.',
    address: 'Alpspitzbahn 1, 87484 Nesselwang',
    parking: 'Kostenloser Parkplatz direkt an der Talstation',
    openingHours: 'Mai – Okt: täglich 9–17 Uhr · Nov – Apr: nur Sa & So',
    pathCondition: ['hiking'],
    lat: 47.6298,
    lng: 10.5001,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 2,
    name: 'Niedersonthofener See',
    subline: 'Klarer Naturbadesee mit flachem Ufer für die Kleinen',
    region: 'Unterallgäu',
    category: 'Baden',
    cost: 'free',
    priceDetail: 'Eintritt kostenlos',
    ageGroups: ['0-3', '3-6', '6-12', '12+'],
    duration: 'full',
    description: 'Naturbadesee mit flachem Ufer und kristallklarem Wasser – ideal für Familien mit kleinen Kindern. Der sanfte Sandstrand macht ihn zum perfekten Familienbadesee. Liegewiesen, Grillstellen und Toiletten sind vorhanden. An heißen Sommertagen früh kommen – es wird voll!',
    address: 'Seeweg 1, 87730 Bad Grönenbach',
    parking: 'Parkplatz am See, 3 € Tagespauschale',
    openingHours: 'Ganzjährig zugänglich, Badesaison Jun – Sep',
    pathCondition: ['stroller', 'bike', 'balance-bike'],
    lat: 47.8620,
    lng: 10.3850,
    images: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'Ravensburger Spieleland',
    subline: 'Freizeitpark mit über 70 Attraktionen für die ganze Familie',
    region: 'Bodenseeregion',
    category: 'Attraktion',
    cost: 'paid',
    priceDetail: 'Ab 3 Jahren: 38,50 €, unter 3 gratis · Online günstiger',
    ageGroups: ['3-6', '6-12'],
    duration: 'full',
    description: 'Familienfreizeitpark rund um die Ravensburger Spielewelt mit über 70 Attraktionen. Besonders geeignet für Kinder zwischen 2 und 12 Jahren. Memory-Turm, Kugelbahn, Bällebad – hier ist für jedes Alter etwas dabei. Plant mindestens einen ganzen Tag ein.',
    address: 'Ravensburger-Spieleland-Str. 1, 88138 Meckenbeuren',
    parking: 'Großer Parkplatz am Eingang, 6 € pro Tag',
    openingHours: 'Apr – Nov: täglich 9–18 Uhr (Sommer bis 19 Uhr)',
    pathCondition: ['stroller'],
    lat: 47.6950,
    lng: 9.5590,
    images: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 4,
    name: 'Spielplatz Stadtpark Kempten',
    subline: 'Großer Abenteuerspielplatz direkt am Illerufer',
    region: 'Oberallgäu',
    category: 'Spielplatz',
    cost: 'free',
    priceDetail: 'Eintritt kostenlos',
    ageGroups: ['0-3', '3-6', '6-12'],
    duration: 'short',
    description: 'Weitläufiger Abenteuerspielplatz im Kemptener Stadtpark mit Klettergerüsten, Wasserspielen, Sandkasten und großen Rasenflächen zum Toben. Der Park liegt direkt am Illerufer – ideal für einen Spaziergang nach dem Spielen. Mehrere Bänke und ein Kiosk in der Nähe.',
    address: 'Stadtpark, 87435 Kempten (Allgäu)',
    parking: 'Tiefgarage Stadtpark, 1. Stunde gratis',
    openingHours: 'Ganzjährig, jederzeit zugänglich',
    pathCondition: ['stroller', 'balance-bike'],
    lat: 47.7258,
    lng: 10.3173,
    images: [
      'https://images.unsplash.com/photo-1587652990124-0e7c8ae8cf90?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1597671862479-4b19c56e0ccc?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1536500152107-01ab1422f932?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 5,
    name: 'Alpaka-Wanderung Weitnau',
    subline: 'Geführte Wanderung mit Alpakas durch das Westallgäu',
    region: 'Westallgäu',
    category: 'Tierpark',
    cost: 'cheap',
    priceDetail: 'Ca. 15 € pro Person, Kleinkinder gratis · Anmeldung erforderlich',
    ageGroups: ['3-6', '6-12', '12+'],
    duration: 'half',
    description: 'Geführte Wanderungen mit zutraulichen Alpakas durch die sanfte Hügellandschaft des Westallgäus. Die Tiere sind sehr zahm und reagieren toll auf Kinder. Die Wanderung dauert etwa 1,5 Stunden, danach gibt es Zeit zum Streicheln und Füttern auf dem Hof. Bitte robuste Schuhe mitbringen.',
    address: 'Alpakahof, 87480 Weitnau',
    parking: 'Kostenloser Hofparkplatz',
    openingHours: 'Wanderungen Apr – Okt, Fr/Sa/So · Anmeldung unter 08375-1234',
    pathCondition: ['hiking'],
    lat: 47.6283,
    lng: 10.1128,
    images: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1573160103600-cf79c8aa4116?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=500&fit=crop',
    ],
  },
]
