// lib/shapes/data.ts — Allgäu family destinations dataset + helpers
// Ported from the Claude-Design "Shapes" prototype (data.jsx).
/* eslint-disable @typescript-eslint/no-explicit-any */

export type ShapesDest = {
  id: string; name: string; place: string; cat: string;
  ages: string[]; time: string; budget: string; weather: string; stroller: boolean;
  map: { x: number; y: number }; rating: number; reviews: number;
  blurb: string; highlights: string[]; facilities: string[]; season: string; duration: string;
  tags?: string[]; teaser?: string;
}
export type Sel = {
  ages?: string[]; cats?: string[]; types?: string[]; times?: string[];
  budgets?: string[]; weather?: string | null; stroller?: boolean;
}


export const CATEGORIES = {
  natur:   { id: "natur",   label: "Natur & Wandern",     short: "Natur",    hue: 150, emoji: "🌲" },
  wasser:  { id: "wasser",  label: "Wasser & Baden",      short: "Wasser",   hue: 255, emoji: "💧" },
  tiere:   { id: "tiere",   label: "Tiere & Bauernhof",   short: "Tiere",    hue: 45,  emoji: "🐄" },
  action:  { id: "action",  label: "Action & Spaß",       short: "Action",   hue: 300, emoji: "🎢" },
  regen:   { id: "regen",   label: "Regentag & Indoor",   short: "Indoor",   hue: 295, emoji: "🌧️" },
};

// Activity TYPES — drawn from the uploaded icon set. Each destination carries a
// few of these as badges. Badge background uses the brand poster palette; the
// icon itself renders in navy on top.
export const TYPES = {
  ausflug:    { id: "ausflug",    label: "Wandern",     icon: "ausflug",    color: "#F7C125" },
  schwimmen:  { id: "schwimmen",  label: "Baden",       icon: "schwimmen",  color: "#BAA3FF" },
  spielplatz: { id: "spielplatz", label: "Spielplatz",  icon: "spielplatz", color: "#FFA3EB" },
  tierpark:   { id: "tierpark",   label: "Tiere",       icon: "tierpark",   color: "#FF932F" },
  sport:      { id: "sport",      label: "Sport",       icon: "sport",      color: "#FF932F" },
  attraktion: { id: "attraktion", label: "Attraktion",  icon: "attraktion", color: "#FFA3EB" },
  kultur:     { id: "kultur",     label: "Kultur",      icon: "kultur",     color: "#BAA3FF" },
  kreatives:  { id: "kreatives",  label: "Kreativ",     icon: "kreatives",  color: "#F7C125" },
  gastro:     { id: "gastro",     label: "Einkehr",     icon: "gastro",     color: "#F7C125" },
};

export const DEST_TAGS = {
  "breitachklamm": ["ausflug", "sport"],
  "skywalk": ["ausflug", "spielplatz"],
  "alpsee-coaster": ["attraktion", "spielplatz"],
  "skyline-park": ["attraktion", "sport"],
  "ziegelwies": ["ausflug", "spielplatz"],
  "eistobel": ["ausflug", "schwimmen"],
  "aquaria": ["schwimmen", "spielplatz"],
  "bergbauernmuseum": ["tierpark", "kultur"],
  "soellereck": ["attraktion", "spielplatz"],
  "sturmannshoehle": ["ausflug", "kultur"],
  "neuschwanstein": ["kultur", "ausflug"],
  "kletterwald-bärenfalle": ["sport", "ausflug"],
  "moorbad-schwarzenberg": ["schwimmen", "ausflug"],
  "vogelpark": ["tierpark", "spielplatz"],
  "iglu-indoorspielplatz": ["spielplatz", "kreatives"],
  "hündle": ["attraktion", "spielplatz"],
};

// Age buckets
export const AGES = [
  { id: "0-2",  label: "0–2 J.",  sub: "Baby & Kleinkind" },
  { id: "3-5",  label: "3–5 J.",  sub: "Kindergarten" },
  { id: "6-9",  label: "6–9 J.",  sub: "Grundschule" },
  { id: "10+",  label: "10+ J.",  sub: "Große Kinder" },
];

export const TIMES = [
  { id: "kurz",  label: "Bis 2 Std.", sub: "Kurzer Ausflug" },
  { id: "halb",  label: "Halbtags",   sub: "3–5 Stunden" },
  { id: "ganz",  label: "Ganztags",   sub: "Der ganze Tag" },
];

export const BUDGETS = [
  { id: "frei", label: "Kostenlos", sub: "Gratis", glyph: "0 €" },
  { id: "€",    label: "Günstig",   sub: "bis ~10 €/Pers.", glyph: "€" },
  { id: "€€",   label: "Mittel",    sub: "10–25 €/Pers.", glyph: "€€" },
  { id: "€€€",  label: "Premium",   sub: "ab ~25 €/Pers.", glyph: "€€€" },
];

// Each destination: id, name, place, cat, ages[], time, budget, weather (gut/egal/regen),
// stroller, lat/lng (relative 0..100 on our stylized map), blurb, highlights[], facilities[], season
export const DESTINATIONS: ShapesDest[] = [
  {
    id: "breitachklamm", name: "Breitachklamm", place: "Oberstdorf", cat: "natur",
    ages: ["3-5","6-9","10+"], time: "halb", budget: "€", weather: "gut", stroller: false,
    map: { x: 22, y: 78 }, rating: 4.8, reviews: 1240,
    blurb: "Tiefste Felsenschlucht Mitteleuropas — tosendes Wasser, schmale Stege und ein Abenteuer für größere Kinder.",
    highlights: ["Spektakuläre Schlucht", "Gut gesicherte Wege", "Im Winter Eiswelt"],
    facilities: ["Parkplatz", "Kiosk", "WC"], season: "Ganzjährig", duration: "ca. 2–3 Std.",
  },
  {
    id: "skywalk", name: "Skywalk Allgäu", place: "Scheidegg", cat: "natur",
    ages: ["0-2","3-5","6-9","10+"], time: "halb", budget: "€€", weather: "gut", stroller: true,
    map: { x: 8, y: 52 }, rating: 4.6, reviews: 980,
    blurb: "Baumwipfelpfad mit Hängebrücken, Barfußpfad und Bergblick — komplett kinderwagen­tauglich.",
    highlights: ["Kinderwagentauglich", "Barfußpfad", "Naturspielplatz"],
    facilities: ["Parkplatz", "Restaurant", "WC", "Wickelraum"], season: "Apr–Nov", duration: "ca. 2–3 Std.",
  },
  {
    id: "alpsee-coaster", name: "Alpsee Bergwelt", place: "Immenstadt", cat: "action",
    ages: ["3-5","6-9","10+"], time: "ganz", budget: "€€€", weather: "gut", stroller: false,
    map: { x: 38, y: 58 }, rating: 4.7, reviews: 2110,
    blurb: "Deutschlands längste Ganzjahres-Rodelbahn, Kletterwald und riesiger Bärenfalle-Spielplatz mit Bergsee.",
    highlights: ["Alpsee Coaster", "Großer Spielplatz", "Sessellift"],
    facilities: ["Parkplatz", "Bergrestaurant", "WC", "Wickelraum"], season: "Ganzjährig", duration: "Halb- bis Ganztags",
  },
  {
    id: "skyline-park", name: "Allgäu Skyline Park", place: "Bad Wörishofen", cat: "action",
    ages: ["3-5","6-9","10+"], time: "ganz", budget: "€€€", weather: "gut", stroller: true,
    map: { x: 74, y: 18 }, rating: 4.5, reviews: 5400,
    blurb: "Größter Freizeitpark Bayerns mit über 60 Attraktionen — von der Kleinkind-Ecke bis zur Highspeed-Achterbahn.",
    highlights: ["60+ Fahrgeschäfte", "Kleinkindbereich", "Shows"],
    facilities: ["Parkplatz", "Gastronomie", "WC", "Wickelraum"], season: "Apr–Nov", duration: "Ganztags",
  },
  {
    id: "ziegelwies", name: "Walderlebniszentrum Ziegelwies", place: "Füssen", cat: "natur",
    ages: ["0-2","3-5","6-9"], time: "halb", budget: "frei", weather: "gut", stroller: true,
    map: { x: 64, y: 84 }, rating: 4.7, reviews: 760,
    blurb: "Baumkronenweg über die Landesgrenze, Walderlebnispfad und Barfußweg — und das alles kostenlos.",
    highlights: ["Kostenlos", "Baumkronenweg", "Walderlebnispfad"],
    facilities: ["Parkplatz", "Café", "WC", "Wickelraum"], season: "Mai–Okt", duration: "ca. 2–3 Std.",
  },
  {
    id: "eistobel", name: "Eistobel", place: "Maierhöfen", cat: "wasser",
    ages: ["6-9","10+"], time: "halb", budget: "frei", weather: "gut", stroller: false,
    map: { x: 18, y: 36 }, rating: 4.6, reviews: 540,
    blurb: "Wilde Wasserschlucht mit Wasserfällen, Gumpen und Strudeltöpfen entlang eines schattigen Wanderwegs.",
    highlights: ["Wasserfälle", "Schattig im Sommer", "Kostenlos"],
    facilities: ["Parkplatz", "Infohaus", "WC"], season: "Apr–Okt", duration: "ca. 2 Std.",
  },
  {
    id: "aquaria", name: "Aquaria Erlebnisbad", place: "Bad Wörishofen", cat: "wasser",
    ages: ["0-2","3-5","6-9","10+"], time: "halb", budget: "€€", weather: "regen", stroller: true,
    map: { x: 78, y: 22 }, rating: 4.4, reviews: 1320,
    blurb: "Großes Erlebnisbad mit Kleinkind-Lagune, Rutschen und warmem Außenbecken — auch bei Regen perfekt.",
    highlights: ["Kleinkind-Lagune", "Rutschen", "Auch bei Regen"],
    facilities: ["Parkplatz", "Gastronomie", "WC", "Wickelraum", "Schließfächer"], season: "Ganzjährig", duration: "Halbtags",
  },
  {
    id: "bergbauernmuseum", name: "Allgäuer Bergbauernmuseum", place: "Diepolz", cat: "tiere",
    ages: ["0-2","3-5","6-9"], time: "halb", budget: "€", weather: "egal", stroller: true,
    map: { x: 30, y: 46 }, rating: 4.7, reviews: 690,
    blurb: "Lebendiger Bauernhof auf 1000 m mit Kühen, Ziegen und Hühnern zum Anfassen, Spielscheune und Museum.",
    highlights: ["Tiere zum Anfassen", "Spielscheune", "Höchstgelegenes Museum"],
    facilities: ["Parkplatz", "Café", "WC", "Wickelraum"], season: "Mär–Nov", duration: "ca. 3 Std.",
  },
  {
    id: "soellereck", name: "Söllereck Bergwelt", place: "Oberstdorf", cat: "action",
    ages: ["3-5","6-9","10+"], time: "halb", budget: "€€", weather: "gut", stroller: false,
    map: { x: 26, y: 88 }, rating: 4.6, reviews: 870,
    blurb: "Sommerrodelbahn, Bergbahn und der weitläufige Erlebnisberg „Eckis Kinderland“ mit Wasserspielplatz.",
    highlights: ["Sommerrodelbahn", "Eckis Kinderland", "Wasserspielplatz"],
    facilities: ["Parkplatz", "Bergrestaurant", "WC"], season: "Mai–Okt", duration: "Halbtags",
  },
  {
    id: "sturmannshoehle", name: "Sturmannshöhle", place: "Obermaiselstein", cat: "regen",
    ages: ["6-9","10+"], time: "kurz", budget: "€", weather: "regen", stroller: false,
    map: { x: 28, y: 70 }, rating: 4.5, reviews: 410,
    blurb: "Geführte Tour durch die einzige begehbare Tropfsteinhöhle des Allgäus — kühl, geheimnisvoll, ideal bei Hitze.",
    highlights: ["Führung", "Auch bei Regen", "Kühl im Sommer"],
    facilities: ["Parkplatz", "Kiosk", "WC"], season: "Mai–Okt", duration: "ca. 1 Std.",
  },
  {
    id: "neuschwanstein", name: "Schloss Neuschwanstein", place: "Schwangau", cat: "natur",
    ages: ["6-9","10+"], time: "ganz", budget: "€€€", weather: "egal", stroller: false,
    map: { x: 60, y: 80 }, rating: 4.5, reviews: 8900,
    blurb: "Das Märchenschloss von König Ludwig II. — mit Kutschfahrt, Marienbrücke und großem Schlosspark.",
    highlights: ["Märchenschloss", "Kutschfahrt", "Marienbrücke"],
    facilities: ["Parkplatz", "Gastronomie", "WC"], season: "Ganzjährig", duration: "Halb- bis Ganztags",
  },
  {
    id: "kletterwald-bärenfalle", name: "Kletterwald Bärenfalle", place: "Immenstadt", cat: "action",
    ages: ["6-9","10+"], time: "halb", budget: "€€€", weather: "gut", stroller: false,
    map: { x: 36, y: 60 }, rating: 4.6, reviews: 520,
    blurb: "Hochseilgarten mit Parcours in allen Höhen — Nervenkitzel ab Grundschulalter, sicher gesichert.",
    highlights: ["Hochseilgarten", "Mehrere Schwierigkeiten", "Ab 6 Jahren"],
    facilities: ["Parkplatz", "Imbiss", "WC"], season: "Apr–Okt", duration: "ca. 3 Std.",
  },
  {
    id: "moorbad-schwarzenberg", name: "Naturbadesee Niedersonthofen", place: "Waltenhofen", cat: "wasser",
    ages: ["0-2","3-5","6-9","10+"], time: "halb", budget: "frei", weather: "gut", stroller: true,
    map: { x: 34, y: 40 }, rating: 4.4, reviews: 330,
    blurb: "Flach abfallender Badesee mit Liegewiese, Sandstrand und Tretbooten — entspannter Familien-Badetag.",
    highlights: ["Flaches Wasser", "Sandstrand", "Tretboote"],
    facilities: ["Parkplatz", "Kiosk", "WC", "Liegewiese"], season: "Jun–Sep", duration: "Halbtags",
  },
  {
    id: "vogelpark", name: "Vogelpark & Streichelzoo", place: "Sonthofen", cat: "tiere",
    ages: ["0-2","3-5","6-9"], time: "kurz", budget: "€", weather: "egal", stroller: true,
    map: { x: 32, y: 64 }, rating: 4.3, reviews: 280,
    blurb: "Kleiner, ruhiger Tierpark mit Papageien, Ziegen und Kaninchen — überschaubar für die Kleinsten.",
    highlights: ["Streichelzoo", "Überschaubar", "Spielplatz"],
    facilities: ["Parkplatz", "Kiosk", "WC", "Wickelraum"], season: "Mär–Okt", duration: "ca. 1–2 Std.",
  },
  {
    id: "iglu-indoorspielplatz", name: "Indoorspielplatz Tobel", place: "Kempten", cat: "regen",
    ages: ["0-2","3-5","6-9"], time: "halb", budget: "€€", weather: "regen", stroller: true,
    map: { x: 40, y: 30 }, rating: 4.2, reviews: 610,
    blurb: "Riesige Indoor-Spielwelt mit Klettergerüsten, Bällebad und Kleinkindbereich — wetterunabhängiger Toberaum.",
    highlights: ["Wetterunabhängig", "Bällebad", "Kleinkindbereich"],
    facilities: ["Parkplatz", "Café", "WC", "Wickelraum"], season: "Ganzjährig", duration: "Halbtags",
  },
  {
    id: "hündle", name: "Hündle Erlebnisbahn", place: "Oberstaufen", cat: "action",
    ages: ["0-2","3-5","6-9"], time: "halb", budget: "€€", weather: "gut", stroller: true,
    map: { x: 14, y: 46 }, rating: 4.5, reviews: 740,
    blurb: "Familienberg mit Sommerrodelbahn, Murmelbahn und Erlebnisspielplatz direkt an der Bergstation.",
    highlights: ["Sommerrodelbahn", "Murmelbahn", "Bergspielplatz"],
    facilities: ["Parkplatz", "Bergrestaurant", "WC", "Wickelraum"], season: "Mai–Okt", duration: "Halbtags",
  },
];

// Curated collections for the home screen
export const COLLECTIONS = [
  { id: "regen", title: "Wenn es regnet", sub: "Trocken & trotzdem toll", ids: ["aquaria","sturmannshoehle","iglu-indoorspielplatz","bergbauernmuseum"] },
  { id: "gratis", title: "Kostenlose Ausflüge", sub: "Spaß für 0 €", ids: ["ziegelwies","eistobel","moorbad-schwarzenberg"] },
  { id: "kleinkind", title: "Schon für die Kleinsten", sub: "Ab 0 Jahren, kinderwagentauglich", ids: ["skywalk","vogelpark","bergbauernmuseum","hündle"] },
  { id: "adrenalin", title: "Für kleine Abenteurer", sub: "Action ab Grundschulalter", ids: ["alpsee-coaster","kletterwald-bärenfalle","breitachklamm","soellereck"] },
];

export function getDest(id: string): ShapesDest | undefined { return DESTINATIONS.find(d => d.id === id); }

// Short editorial cover hooks — the punchy line printed on the feed-post cover.
export const DEST_TEASERS = {
  "breitachklamm":          "Mitten durch die Klamm",
  "skywalk":                "Über den Baumwipfeln",
  "alpsee-coaster":         "Rodeln & rasen",
  "skyline-park":           "60 Fahrgeschäfte",
  "ziegelwies":             "Wald gratis erleben",
  "eistobel":               "Wilde Wasserfälle",
  "aquaria":                "Rutschen bei jedem Wetter",
  "bergbauernmuseum":       "Tiere zum Anfassen",
  "soellereck":             "Sommerrodeln am Berg",
  "sturmannshoehle":        "Ab in die Höhle",
  "neuschwanstein":         "Wie im Märchen",
  "kletterwald-bärenfalle": "Hoch hinaus",
  "moorbad-schwarzenberg":  "Badetag am See",
  "vogelpark":              "Streicheln erlaubt",
  "iglu-indoorspielplatz":  "Toben bei Regen",
  "hündle":                 "Bergspaß für alle",
};

// Attach activity tags + cover hook to each destination.
DESTINATIONS.forEach((d: any) => {
  d.tags = (DEST_TAGS as Record<string, string[]>)[d.id] || ["ausflug"];
  d.teaser = (DEST_TEASERS as Record<string, string>)[d.id] || d.highlights?.[0] || "Familienausflug";
});

// Score a destination against a filter selection (used by quiz + filter)
export function matchScore(dest: ShapesDest, sel: Sel) {
  // sel: { ages:[], times:[], budgets:[], cats:[], weather, stroller }
  let score = 0, max = 0;
  const has = (arr: any[] | undefined) => arr && arr.length;
  if (has(sel.ages)) { max += 2; if (sel.ages?.some(a => dest.ages.includes(a))) score += 2; }
  if (has(sel.cats)) { max += 3; if (sel.cats?.includes(dest.cat)) score += 3; }
  if (has(sel.types)) { max += 3; if (sel.types?.some(t => (dest.tags || []).includes(t))) score += 3; }
  if (has(sel.times)) { max += 1; if (sel.times?.includes(dest.time)) score += 1; }
  if (has(sel.budgets)) { max += 1; if (sel.budgets?.includes(dest.budget)) score += 1; }
  if (sel.weather === "regen") { max += 2; if (dest.weather === "regen") score += 2; }
  if (sel.stroller) { max += 2; if (dest.stroller) score += 2; }
  return max === 0 ? 1 : score / max;
}

export function filterDests(sel: Sel) {
  // Hard filter (must match every chosen facet group that is set)
  return DESTINATIONS.filter(d => {
    if (sel.ages?.length && !sel.ages?.some(a => d.ages.includes(a))) return false;
    if (sel.cats?.length && !sel.cats?.includes(d.cat)) return false;
    if (sel.types?.length && !sel.types?.some(t => (d.tags || []).includes(t))) return false;
    if (sel.times?.length && !sel.times?.includes(d.time)) return false;
    if (sel.budgets?.length && !sel.budgets?.includes(d.budget)) return false;
    if (sel.weather === "regen" && d.weather !== "regen") return false;
    if (sel.stroller && !d.stroller) return false;
    return true;
  });
}


// ── Detail-Infos: die 6 Kundinnen-Kategorien je Ziel. Einige Werte sind
// Platzhalter (abgeleitet), bis echte Daten kommen. ──
const PRICE_BY_BUDGET: Record<string, string> = {
  frei: 'Kostenlos',
  '€': 'Günstig – bis ~10 €/Person',
  '€€': 'Erwachsene ~12 €, Kinder ~7 €',
  '€€€': 'Erwachsene ~25 €, Kinder ~15 €',
}

export type DetailInfo = {
  ort: string
  parkplatz: string
  preis: string
  oeffnungszeiten: string
  dauer: string
  wegbeschaffenheit: string[]
}

export function detailInfo(d: ShapesDest): DetailInfo {
  return {
    ort: d.place,
    parkplatz: d.facilities.includes('Parkplatz') ? 'Kostenloser Parkplatz vor Ort' : 'Parkplatz in der Nähe',
    preis: PRICE_BY_BUDGET[d.budget] ?? '—',
    oeffnungszeiten: `${d.season} · täglich 9–17 Uhr`,
    dauer: d.duration,
    wegbeschaffenheit: d.stroller ? ['Kinderwagen', 'Laufrad'] : ['Fahrrad'],
  }
}

// Activity tags for a destination → human labels, for the detail page.
export function destTags(d: ShapesDest): string[] {
  const ids = d.tags ?? (DEST_TAGS as Record<string, string[]>)[d.id] ?? []
  return ids
    .map((tid) => (TYPES as Record<string, { label: string }>)[tid]?.label)
    .filter((l): l is string => Boolean(l))
}
