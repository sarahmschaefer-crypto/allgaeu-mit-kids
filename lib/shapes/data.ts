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
  ages?: string[]; types?: string[]; times?: string[];
  budgets?: string[]; weather?: string | null; stroller?: boolean;
  parking?: boolean; access?: string[]; ort?: string; radius?: number;
}


// Activity TYPES — drawn from the uploaded icon set. Each destination carries a
// few of these as badges. Badge background uses the brand poster palette; the
// icon itself renders in navy on top.
// Labels, icons (→ public/tags/<icon>.svg) and colours taken from the design
// system (Tag.png / Icon set). Each tag renders as a coloured pill with a white
// masked icon + name.
// Die 11 Kategorie-Tags des Design-Systems (Figma „Shapes Tag"), jeweils mit
// eigenem Icon (public/tags/<icon>.svg). Vollständiger Satz — auch Kategorien,
// die (noch) kein Ziel trägt, gehören zur Komponente.
export const TYPES = {
  ausflug:    { id: "ausflug",    label: "Ausflug",     icon: "ausflug",    color: "#9ba1ff" },
  schwimmen:  { id: "schwimmen",  label: "Baden",       icon: "schwimmen",  color: "#7ee6c5" },
  sport:      { id: "sport",      label: "Sport",       icon: "sport",      color: "#baa3ff" },
  shop:       { id: "shop",       label: "Shop",        icon: "shop",       color: "#7ccbff" },
  spielplatz: { id: "spielplatz", label: "Spielplatz",  icon: "spielplatz", color: "#b175ff" },
  attraktion: { id: "attraktion", label: "Attraktion",  icon: "attraktion", color: "#d0c75d" },
  gastro:     { id: "gastro",     label: "Gastro",      icon: "gastro",     color: "#ffa3eb" },
  tierpark:   { id: "tierpark",   label: "Tiere",       icon: "tierpark",   color: "#f0922e" },
  kreatives:  { id: "kreatives",  label: "Kreatives",   icon: "kreatives",  color: "#ff8d7c" },
  unterkunft: { id: "unterkunft", label: "Unterkunft",  icon: "unterkunft", color: "#ff9f44" },
  kultur:     { id: "kultur",     label: "Kultur",      icon: "kultur",     color: "#8de189" },
};

// Activity tags a destination carries, resolved from the inline `tags` field or
// the central DEST_TAGS map. One source for filtering, matching and detail page.
export function tagsOf(d: ShapesDest): string[] {
  return d.tags ?? (DEST_TAGS as Record<string, string[]>)[d.id] ?? [];
}

// Kuratierter Haupt-Tag je Ziel — treibt das Karten-Label (Tag-Dot-Variante).
// Ersetzt die alten 5 Kategorien (natur/action/…), die es nicht mehr gibt.
export const PRIMARY_TAG: Record<string, string> = {
  "breitachklamm": "ausflug", "skywalk": "ausflug", "alpsee-coaster": "attraktion",
  "skyline-park": "attraktion", "ziegelwies": "ausflug", "eistobel": "ausflug",
  "aquaria": "schwimmen", "bergbauernmuseum": "tierpark", "soellereck": "attraktion",
  "sturmannshoehle": "ausflug", "neuschwanstein": "kultur", "kletterwald-bärenfalle": "sport",
  "moorbad-schwarzenberg": "schwimmen", "vogelpark": "tierpark", "iglu-indoorspielplatz": "spielplatz",
  "hündle": "attraktion",
};
export function primaryTagOf(d: ShapesDest): string {
  return PRIMARY_TAG[d.id] || tagsOf(d)[0] || "ausflug";
}

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

// The tags offered in the "Worauf habt ihr Lust?" filter — only those at least
// one destination actually carries, in display order.
const TAG_ORDER = ["ausflug", "schwimmen", "sport", "shop", "spielplatz", "attraktion", "gastro", "tierpark", "kreatives", "unterkunft", "kultur"];
export const LUST_TAGS = (() => {
  const used = new Set(Object.values(DEST_TAGS).flat());
  return TAG_ORDER.filter((id) => used.has(id)).map(
    (id) => (TYPES as Record<string, { id: string; label: string; icon: string; color: string }>)[id],
  );
})();

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
  if (has(sel.types)) { max += 3; if (sel.types?.some(t => tagsOf(dest).includes(t))) score += 3; }
  if (has(sel.times)) { max += 1; if (sel.times?.includes(dest.time)) score += 1; }
  if (has(sel.budgets)) { max += 1; if (sel.budgets?.includes(dest.budget)) score += 1; }
  if (sel.weather === "regen") { max += 2; if (dest.weather === "regen") score += 2; }
  if (sel.stroller) { max += 2; if (dest.stroller) score += 2; }
  return max === 0 ? 1 : score / max;
}

// ── Geo: approximate (placeholder) coordinates for the radius/"Umkreis" filter.
// DEST_GEO = each attraction; TOWN_GEO = town centres usable as search centre.
// Values are rough and meant to be refined with real data later. ──
type LatLng = { lat: number; lng: number };

export const DEST_GEO: Record<string, LatLng> = {
  "breitachklamm":         { lat: 47.388, lng: 10.221 },
  "skywalk":               { lat: 47.595, lng: 9.838 },
  "alpsee-coaster":        { lat: 47.586, lng: 10.118 },
  "skyline-park":          { lat: 48.092, lng: 10.535 },
  "ziegelwies":            { lat: 47.566, lng: 10.717 },
  "eistobel":              { lat: 47.611, lng: 9.985 },
  "aquaria":               { lat: 48.006, lng: 10.594 },
  "bergbauernmuseum":      { lat: 47.585, lng: 10.165 },
  "soellereck":            { lat: 47.392, lng: 10.252 },
  "sturmannshoehle":       { lat: 47.422, lng: 10.211 },
  "neuschwanstein":        { lat: 47.5576, lng: 10.7498 },
  "kletterwald-bärenfalle":{ lat: 47.560, lng: 10.210 },
  "moorbad-schwarzenberg": { lat: 47.617, lng: 10.252 },
  "vogelpark":             { lat: 47.515, lng: 10.281 },
  "iglu-indoorspielplatz": { lat: 47.726, lng: 10.317 },
  "hündle":                { lat: 47.557, lng: 10.045 },
};

export const TOWN_GEO: Record<string, LatLng> = {
  "Oberstdorf":     { lat: 47.410, lng: 10.279 },
  "Fischen":        { lat: 47.456, lng: 10.275 },
  "Sonthofen":      { lat: 47.515, lng: 10.281 },
  "Bad Hindelang":  { lat: 47.508, lng: 10.378 },
  "Immenstadt":     { lat: 47.561, lng: 10.218 },
  "Diepolz":        { lat: 47.585, lng: 10.165 },
  "Oberstaufen":    { lat: 47.555, lng: 10.025 },
  "Scheidegg":      { lat: 47.578, lng: 9.847 },
  "Lindenberg":     { lat: 47.602, lng: 9.892 },
  "Maierhöfen":     { lat: 47.620, lng: 10.012 },
  "Obermaiselstein":{ lat: 47.418, lng: 10.225 },
  "Waltenhofen":    { lat: 47.660, lng: 10.307 },
  "Kempten":        { lat: 47.726, lng: 10.317 },
  "Wertach":        { lat: 47.597, lng: 10.410 },
  "Nesselwang":     { lat: 47.622, lng: 10.503 },
  "Pfronten":       { lat: 47.575, lng: 10.555 },
  "Füssen":         { lat: 47.571, lng: 10.701 },
  "Schwangau":      { lat: 47.578, lng: 10.738 },
  "Bad Wörishofen": { lat: 48.005, lng: 10.600 },
};

// Town names for the search datalist, sorted alphabetically (de).
export const TOWNS = Object.keys(TOWN_GEO).sort((a, b) => a.localeCompare(b, "de"));

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371, toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Resolve a typed place to a centre coordinate: exact, then prefix match.
export function resolveCenter(q: string): LatLng | null {
  const n = q.trim().toLowerCase();
  if (!n) return null;
  const exact = TOWNS.find((t) => t.toLowerCase() === n);
  if (exact) return TOWN_GEO[exact];
  const pre = TOWNS.find((t) => t.toLowerCase().startsWith(n));
  return pre ? TOWN_GEO[pre] : null;
}

// Distance (km) from a centre to a destination, or null if unknown.
export function distanceKm(center: LatLng, d: ShapesDest): number | null {
  const g = DEST_GEO[d.id];
  return g ? haversineKm(center, g) : null;
}

export function filterDests(sel: Sel) {
  const ort = sel.ort?.trim();
  const center = ort ? resolveCenter(ort) : null;
  const radius = sel.radius ?? 25;
  // Hard filter (must match every chosen facet group that is set)
  return DESTINATIONS.filter(d => {
    if (sel.ages?.length && !sel.ages?.some(a => d.ages.includes(a))) return false;
    if (sel.types?.length && !sel.types?.some(t => tagsOf(d).includes(t))) return false;
    if (sel.times?.length && !sel.times?.includes(d.time)) return false;
    if (sel.budgets?.length && !sel.budgets?.includes(d.budget)) return false;
    if (sel.weather === "regen" && d.weather !== "regen") return false;
    if (sel.stroller && !d.stroller) return false;
    if (sel.parking && !d.facilities.includes("Parkplatz")) return false;
    if (sel.access?.length && !sel.access.some(a => accessIds(d).includes(a))) return false;
    if (ort) {
      if (center) {
        // Radius filter: keep destinations within `radius` km of the centre.
        const g = DEST_GEO[d.id];
        if (!g || haversineKm(center, g) > radius) return false;
      } else if (!d.place.toLowerCase().includes(ort.toLowerCase())) {
        // Fallback: plain place-name match for unknown centres.
        return false;
      }
    }
    return true;
  });
}

// ── Wegbeschaffenheit (path access) — derived from `stroller` for now, until
// per-destination data exists. Used by both the filter and the detail page so
// they stay in sync. ──
export const ACCESS_OPTIONS = [
  { id: "kinderwagen", label: "Kinderwagen" },
  { id: "laufrad",     label: "Laufrad" },
  { id: "fahrrad",     label: "Fahrrad" },
] as const;
const ACCESS_LABEL: Record<string, string> = Object.fromEntries(ACCESS_OPTIONS.map(o => [o.id, o.label]));

export function accessIds(d: ShapesDest): string[] {
  return d.stroller ? ["kinderwagen", "laufrad"] : ["fahrrad"];
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
    wegbeschaffenheit: accessIds(d).map((id) => ACCESS_LABEL[id]),
  }
}

// Activity tags for a destination → full tag objects (id/label/icon/color),
// for the detail page and anywhere tags are rendered with their icon.
export type TagDef = { id: string; label: string; icon: string; color: string }
export function destTags(d: ShapesDest): TagDef[] {
  return tagsOf(d)
    .map((tid) => (TYPES as Record<string, TagDef>)[tid])
    .filter((t): t is TagDef => Boolean(t))
}
