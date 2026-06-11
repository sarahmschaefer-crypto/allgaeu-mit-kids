# Allgäu mit Kids — Projekt-Spickzettel

Familien-Ausflugsplattform fürs Allgäu. Next.js 15 · React 19 · Tailwind 4 · TypeScript.

## ⚡ Arbeitsweise mit Sarah (WICHTIG — Tempo!)
- **Sarah prüft visuell SELBST** auf `localhost:3000` (eigener Browser / DevTools-Mobilansicht).
  NICHT Zeit mit dem instabilen Preview-Server + Screenshots verbrennen — der stürzt ab & scrollt
  nicht zuverlässig. Nur **`tsc` (Typen) + kurze DOM-Checks** zum Selbstcheck, dann Sarah schauen lassen.
- **Kurze, fokussierte Schleifen.** Eine Sache pro Runde, dann Feedback. Nicht stundenlang allein verifizieren.
- **Offene Unzufriedenheit (Stand letzter Chat):**
  1. **Journey/Pfad-Animation (§1)** war wiederholt fiddlig/problematisch → wenn es wieder hakt:
     einen **einfacheren, robusten Ansatz vorschlagen** statt weiter am SVG-`dashoffset` zu feilen.
  2. **Gesamteindruck** soll runder werden (UX, Übergänge, „aus einem Guss") — holistischer Politur-Pass.

## Start / Verifizieren
- **Repo:** `~/Developer/allgaeu-mit-kids` (NICHT in iCloud legen — iCloud lagert .git aus & korrumpiert das Repo).
- **Dev-Server:** `npm run dev` HÄNGT hier. Stattdessen:
  `node node_modules/next/dist/bin/next dev -p 3000`
- **Verifizieren primär mit** `npx tsc --noEmit` + gezielten DOM-Checks. Screenshots sparsam (Preview-Server ist instabil).
- **GitHub:** `git@github.com:sarahmschaefer-crypto/allgaeu-mit-kids.git` (SSH).
- **Gewohnheit:** nach jeder sinnvollen Änderung committen + pushen (Rückfallpunkte). Commit-Message endet mit `Co-Authored-By: Claude ...`.

## Architektur
- **Eine Datenquelle:** `lib/shapes/data.ts` (16 Ziele + `filterDests`/`matchScore` + Detail-Infos). Speist Entdecken, Quiz, Sammeln, Detail und die Landing.
- **Gemeinsame Tokens (Shapes-Basis):** Creme-Papier, Navy `#070E70`, Akzent (Tweak, Default Violett), Playfair Display.
  - `app/story.css` (:root + Storytelling-Landing, gescoped unter `#story-root`)
  - `app/shapes.css` (Discovery-Flows, gescoped unter `.shapes-root`)
- **Routen:** `/` Landing · `/entdecken` Filter+Karte (Liste/Karte-Toggle) · `/quiz` · `/sammeln` (Sammelalbum) · `/ausflug/[id]` Detail. `/karte` & `/swipe` → Redirects.
- **Geteilter Filter-Zustand:** `lib/shapes/explore.ts` (`SelState`, `buildExploreHref`). Quiz/Matcher übergeben Filter via URL an `/entdecken`.
- **Geteilte Fragen:** `lib/shapes/questions.ts` (`QUESTIONS`) — Matcher & Quiz nutzen dieselbe Quelle.
- **Landing-State:** `components/story/MatchContext.tsx` koppelt Matcher/Quiz ↔ Galerie.

## Konventionen (Token-sparsam!)
- **CSS-Klassen statt Inline-Styles.** Wiederkehrende Muster (Karten, Info-Zeilen, Galerie) als Klasse in `shapes.css`/`story.css`, nicht als wiederholtes `style={{…}}`.
- **Edit statt Write** für kleine Änderungen.
- Bausteine in `components/shapes/`: `DestCard`, `CatPill`, `Photo`, `Stars`, `Container`, `ShapesBar` (Navbar), `decor.tsx` (Blob/Squiggle).
- Story-Szenen in `components/story/`: Hero, Journey, LandingQuiz, Horizontal, SammelnTeaser, Resolution.

## Stehende Entscheidungen (von Sarah — IMMER beachten)
Diese Festlegungen gelten dauerhaft. Bei neuen dauerhaften Anweisungen hier ergänzen.
- **IMMER responsiv bauen** (Desktop + Mobile) — und nach jeder Änderung selbst gegenchecken, ob es sauber ist.
- **Journey-Bilder:** sollen mittig im Viewport „aufploppen" (beim Scrollen zentral erscheinen, nie off-screen).
- **Bilder:** Platzhalter, bis echte Fotos kommen. Hero = `public/hero-lake.jpg` (Allgäu-See).
- **Navbar:** primärer „Ausflugsziel finden"-Button (→ /quiz). KEIN schwebender Floating-CTA.
- **Hero:** Foto im Allgäu-Umriss, KEIN gezeichneter Stroke/Umrandung.
- **Journey (§1):** gewundener Pfad, NICHT gepinnt — zeichnet sich beim Mitscrollen entlang der
  Pfadlänge (`stroke-dashoffset`, smooth, keine Sprünge). Befahren = durchgezogen, davor = gestrichelt
  (derselbe Pfad → deckungsgleich). **KEIN Gradient** — einfarbig (`--pine`). Jeder Ort mit Bild.
- **Landing-Aufbau:** Hero → §1 Pfad → §2 Schritt-für-Schritt-Quiz (füttert MatchContext) →
  §3 „Das Allgäu öffnet sich" = echte Treffer als Entdecken-Karten (+ Leerzustand) →
  §4 Abschluss allgemein („weiterstöbern", NICHT treffer-bezogen).
- **Eine Sprache:** Quiz, Matcher, Filter nutzen dieselben Kategorien (`cats`).
- **Detail:** 6 Kategorien (Ort, Parkplatz, Preis, Öffnungszeiten, Dauer, Wegbeschaffenheit) + Bilder-Galerie.
