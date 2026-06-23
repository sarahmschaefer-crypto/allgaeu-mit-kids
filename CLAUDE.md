# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Allgäu mit Kids — Projekt-Spickzettel

Familien-Ausflugsplattform fürs Allgäu. Next.js 15 (App Router) · React 19 · Tailwind 4 · TypeScript. Live auf Vercel: **https://allgaeu-mit-kids.vercel.app**

## Arbeitsweise mit Sarah (WICHTIG — Tempo!)
- **Sarah prüft visuell SELBST** auf `localhost:3000` bzw. der Live-URL (eigener Browser / DevTools-Mobilansicht).
  NICHT Zeit mit dem instabilen Preview-Server + Screenshots verbrennen — er rendert die Landing nur
  1 Viewport hoch, **scrollt nicht** und kollabiert die Viewport-Breite. Scroll-Animationen lassen sich dort
  NICHT verifizieren. Nur `tsc`/Build (Typen) + kurze DOM-Checks zum Selbstcheck, dann Sarah schauen lassen.
- **Kurze, fokussierte Schleifen.** Eine Sache pro Runde, dann Feedback. Nicht stundenlang allein verifizieren.
- **Bei kniffligen Effekten** (Scroll/Parallax/SVG-Pfad): wenn es wiederholt hakt, einen **einfacheren, robusten
  Ansatz vorschlagen** statt weiter zu feilen.

## Start / Verifizieren
- **Repo:** `~/Developer/allgaeu-mit-kids` (NICHT in iCloud legen — iCloud lagert .git aus & korrumpiert das Repo).
- **Dev-Server:** `npm run dev` HÄNGT hier. Stattdessen: `node node_modules/next/dist/bin/next dev -p 3000`
- **Build (Vercel-äquivalent, fängt Prerender-/Typfehler):** `node node_modules/next/dist/bin/next build`
- **Typ-Check:** `npx tsc --noEmit` · **Lint:** `npm run lint`
- **Keine automatisierten Tests** — Verifikation läuft visuell über localhost / Live.
- `'use client'`-Komponenten dürfen `window`/`document` **nur in `useEffect`** anfassen, sonst crasht das SSR-Prerendering.

## Deploy & Branches (KRITISCH)
- **GitHub:** `git@github.com:sarahmschaefer-crypto/allgaeu-mit-kids.git` (SSH).
- **Vercel deployt automatisch den `main`-Branch** bei jedem Push. `main` = die Plattform (= was live geht).
- **`cover-tool`-Branch = parallele Arbeit** am Cover-Builder-Tool (`lib/cover/`, `components/cover/`, `app/admin/`).
  Läuft oft in einer **eigenen Session gleichzeitig** → den Branch/Working-Tree NICHT stören.
  Um auf `main` zu committen, ohne `cover-tool` anzufassen: **`git worktree`** nutzen
  (`git worktree add /tmp/amk-main-wt main`, `node_modules` symlinken, dort editieren/builden/pushen, danach `git worktree remove`).
- **`admin-cms`-Branch = paralleles Content-CMS** im Worktree `~/Developer/allgaeu-mit-kids-admin` (Sarahs Schwester pflegt Ausflug-Inhalte; Postgres/Blob-Store hinter `lib/content/store.ts`, Login-Gate via `middleware.ts` + `ADMIN_PASSWORD`, Drive-Import-Skript). Eigene Vercel-Preview-URL; Merge nach `main` nur bewusst & mit dem cover-tool-Job abgestimmt. **Diese Session NICHT die `lib/cover`/`components/cover`/`app/admin/cover-*`-Dateien anfassen lassen** — die gehören dem Cover-Renderer; das CMS baut nur den Editor darauf.
- **Next.js-Version: Vercel blockt verwundbare Next-Versionen** ("Vulnerable version of Next.js detected" → Build Failed).
  Immer auf einem gepatchten 15.x bleiben (aktuell **15.5.19**, `next` UND `eslint-config-next` gleich halten). Kein Sprung auf 16.
- **Gewohnheit:** nach jeder sinnvollen Änderung committen + pushen. Commit-Message endet mit `Co-Authored-By: Claude ...`.

## Architektur
- **Eine Datenquelle:** `lib/shapes/data.ts` (16 Ziele + `filterDests`/`matchScore` + Detail-Infos). Speist Entdecken, Quiz, Detail und die Landing.
- **Tags statt Kategorien:** `TYPES` = **11 Ausflug-Tags** (mit `trip/*`-Farb-Token + Icons). Pro Ziel ein kuratierter Haupt-Tag via
  `PRIMARY_TAG` / `primaryTagOf(d)`. Die alten 5 Kategorien (natur/action/…) und `CatPill` sind **entfernt** → ersetzt durch
  `TagLabel` (Punkt in Tag-Farbe + Label) in `components/shapes/primitives.tsx`. Foto/Map-Pins sind neutral (keine Kategorie-Farbe).
- **Gemeinsame Tokens (Shapes-Basis):** Creme-Papier `#f7f2e5`, Navy/Ink `#070E70`, Akzent Violett `#8747d7`, Terra `#f67f2f`; Playfair Display.
  - `app/story.css` — `:root`-Tokens + Storytelling-Landing, gescoped unter `#story-root`
  - `app/shapes.css` — Discovery-Flows, gescoped unter `.shapes-root`
  - `app/globals.css` — `@theme`, Buttons, Form-Controls. **Buttons sind eckig** (radius-4); runde Pill-Buttons wurden aus dem System geworfen.
- **Routen:** `/` Landing · `/entdecken` Filter + Karte (Liste/Karte-Toggle, Mobile: Filter-Overlay + 2er-Grid) · `/ausflug/[id]` Detail.
  **`/quiz`, `/sammeln`, `/swipe`, `/karte` → `redirect('/entdecken')`** — Quiz & Sammeln sind vorerst **versteckt** (reversibel: redirect-Zeile raus, Code darunter bleibt). Das Landing-Quiz bleibt aktiv. Der `entdecken`-Nav-Reiter ist obsolet (CTA führt dorthin).
- **Navbar (`components/shapes/ShapesBar.tsx`, Client):** hoch als Default, **schrumpft beim Scrollen** (`is-scrolled`). Logo `public/logo-allgaeu.svg`. CTA „Ausflugsziel finden" → `/entdecken`. Mobile: Hamburger-Menü + immer sichtbarer Floating-CTA. Versteckte Reiter via `HIDDEN_NAV`.
- **Geteilter Filter-Zustand:** `lib/shapes/explore.ts` (`SelState`, `buildExploreHref`). Quiz/Matcher übergeben Filter via URL an `/entdecken`.
- **Geteilte Fragen:** `lib/shapes/questions.ts` (`QUESTIONS`) — Matcher & Quiz nutzen dieselbe Quelle.
- **Landing-State:** `components/story/MatchContext.tsx` koppelt Matcher/Quiz ↔ Treffer-Galerie. Szenen-Animationen laufen über `lib/story/scroll.ts` (`useScrollScene`, rAF-getrieben).
- **Schriften:** Playfair Display, Nunito, JetBrains Mono — via Google-Fonts-`<link>` in `app/layout.tsx` (kein Next.js-Font-Loader).
- **Cover-System (auf `main` gemergt, Schichten-Modell Foto→Rahmen→Scrim→Brand-Grafik→Kategorie-Stempel→Schrift):**
  - **Inhalt von Stil getrennt:** `lib/cover/types.ts` = `CoverSpec` + `COVER_COLORS` (Brand-Palette ink/paper/pink/yellow/purple/orange) + Grafik-/Sticker-Typen. Modi `text-on` (Social, mit Schrift) / `text-light` (Plattform-Card, nur Foto).
  - **Zwei Renderer:** `components/cover/FigmaCover.tsx` = **1:1-Abbild der 19 Figma-Stile** aus „Cover / Feed (4:5)", datengetrieben aus `lib/cover/figma-templates.ts` (px-genaue Layer photo/band/stamp/text/graphic/marker, Werte verbatim aus Figma `get_design_context`; Maße fix 1080×1350, skaliert via `transform`). `components/cover/Cover.tsx` = älterer parametrischer Renderer (Näherungs-Templates + frei platzierte Sticker).
  - **Auto-Generierung:** `lib/cover/figma-auto.ts` `figmaCoverForDest(dest,i,photo)` mappt ein Ziel auf einen Figma-Stil (gute Mischung; Zahl-/Listen-Stile via `needs.number` ausgeschlossen). `lib/cover/presets.ts` `coverFromDest()` für den parametrischen Renderer.
  - **Assets:** `public/cover/stamps/<kategorie>.png` (Kategorie-Stempel, transparent kreisrund freigestellt), `public/cover/graphics/*.svg` (blob1–4, path, spots, footprints, logo-bade — Board-Hintergründe entfernt), `public/fonts/BabyMango.otf` (Cover-Display-Font via `@font-face` in `cover.css`).
  - **Vorschau-Routen (read-only):** `/admin/cover-preview` (Ziele als Auto-Cover im Stil-Mix) · `/admin/figma-check` (Galerie aller 19 Stile).
  - **Der eigentliche Cover-EDITOR gehört ins `admin-cms`-CMS (separater Worktree), NICHT hierher** — EIN Renderer, kein zweiter.

## Konventionen
- **CSS-Klassen statt Inline-Styles.** Wiederkehrende Muster (Karten, Info-Zeilen, Galerie) als Klasse in `shapes.css`/`story.css`.
- **Edit statt Write** für kleine Änderungen.
- **Mobile-Optimierung = nur Mobile.** Desktop muss 1:1 unverändert bleiben → ausschließlich über `max-width`/mobile-only-Regeln arbeiten, nie die Desktop-Darstellung anfassen.
- Bausteine in `components/shapes/`: `DestCard`, `TagLabel`, `Tag`, `Photo`, `Stars`, `ShapesBar`, `DetailGallery`, `ExploreView`, `decor.tsx`.
- Story-Szenen in `components/story/`: `HeroScene`, `JourneyScene`, `LandingQuiz`, `HorizontalScene`(+Resolution), `MatchContext`, `StoryNav`.

## Stehende Entscheidungen (von Sarah — IMMER beachten)
Dauerhaft gültig. Neue dauerhafte Anweisungen hier ergänzen.
- **IMMER responsiv** (Desktop + Mobile), nach jeder Änderung selbst gegenchecken.
- **Hero:** Foto im Allgäu-Umriss als Fenster, KEIN gezeichneter Stroke. Beim Scrollen **öffnet sich die Silhouette und löst sich
  in ein randloses Vollbild-Foto auf** (full-bleed, kein Rand oben/unten/seitlich) mit dezenter Drift. Hero-Foto = `public/hero-lake.jpg`.
- **Landing-Aufbau:** Hero → §1 gewundener Pfad (Path.svg, mehrfarbig, zeichnet sich beim Scrollen, NICHT gepinnt, jeder Ort mit Bild)
  → §2 Schritt-für-Schritt-Quiz (füttert MatchContext) → §3 „Das Allgäu öffnet sich" = echte Treffer als Entdecken-Karten (+ Leerzustand)
  → §4 Abschluss allgemein („weiterstöbern", nicht treffer-bezogen).
- **Journey-Bilder:** mittig im Viewport „aufploppen" (zentral erscheinen, nie off-screen).
- **Eine Sprache:** Quiz, Matcher, Filter nutzen dieselben **11 Tags** (`TYPES`), nicht mehr die alten Kategorien.
- **Detail (`/ausflug/[id]`):** konsolidiertes „Auf einen Blick" (Ort, Für Kinder, Dauer, Öffnungszeiten, Preis, Parkplatz, Wetter, Wegbeschaffenheit) + Highlights + Themen-Tags + Bilder-Galerie.
- **Bilder:** Platzhalter (Unsplash, in `next.config.ts` freigeschaltet), bis echte Fotos kommen.
- **Versteckte Experiences reversibel halten:** Quiz/Sammeln nur per Redirect deaktiviert, Original-Code bleibt erhalten.
