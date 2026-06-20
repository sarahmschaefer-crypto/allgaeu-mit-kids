# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Dieser Worktree ist Branch `admin-cms`** — das **Content-CMS** für „Allgäu mit Kids".
> Der Admin-CMS-Teil unten gilt zuerst; ab „Allgäu mit Kids — Projekt-Spickzettel" folgt die Referenz
> der **öffentlichen App** (Branch `main`), die unverändert weitergilt.

# Admin-CMS (Branch `admin-cms`)

CMS, in dem Sarahs Schwester die **Inhalte der Ausflugsziele** pflegt (nur Inhalt — Layout/Design bleibt
fest; Landing-Page NICHT Teil). Eigener git-Worktree `~/Developer/allgaeu-mit-kids-admin` (von `main`),
damit die **parallel aktive cover-tool-Session** im Haupt-Repo `~/Developer/allgaeu-mit-kids` unberührt bleibt.

## Befehle (dieser Branch)
- **Dev-Server:** `node node_modules/next/dist/bin/next dev -p 3100` — **Port 3100** (cover-tool nutzt 3000).
  ⚠️ Der Store cached im Speicher: nach externem Schreiben (Import-Skript) Dev-Server **neu starten**.
- **Typecheck:** `npx tsc --noEmit` (Hauptverifikation; Preview-Server meiden).
- **Drive-Import:** `npx tsx scripts/import-drive.ts [<lokaler-ordner>]` (Default `scripts/.drive-staging`).

## Architektur (was mehrere Dateien überspannt)
- **Daten-Store hinter schmalem Interface** `lib/content/store.ts` — Phase 1: JSON-Datei
  `data/content.json` (gitignored, **seedet sich aus `lib/shapes/data.ts`**). Phase 2: NUR diese Datei
  wechselt auf Vercel Postgres; die Verbraucher (Admin, künftiger Public-Provider) bleiben gleich.
- **`ContentDest`** (`lib/content/types.ts`) = **Superset von `ShapesDest`** + `photos`, `cover`
  (CoverSpec), `overrides` (Adresse/Öffnung/Preis). Designsystem-Konstanten (`TYPES/AGES/BUDGETS/…`)
  bleiben in `lib/shapes/data.ts`.
- **Cover = Vorschaubild.** Interim-Renderer `components/content/DestPreview.tsx` rendert die CoverSpec
  (Schichten hinten→vorn: Foto/Farbe · Scrim · Slogan + optional Farbbalken · Kategorie-Stempel oben
  rechts; Playfair statt Baby Mango). Wird in **Phase 5 durch den echten `<Cover>`-Renderer** (Branch
  cover-tool) als Drop-in ersetzt.
- **Admin** unter `app/admin/`: Shell (`layout.tsx` + gescoptes `admin.css`) · Liste (`page.tsx`) ·
  Editor (`ausflug/[id]/page.tsx` lädt das Ziel, `Editor.tsx` = Client-Form mit Live-Cover-Vorschau).
  Speichern/Upload via **Server-Actions** `app/admin/actions.ts` (`saveDest` nimmt JSON-Payload aus einem
  Hidden-Feld, `uploadPhoto` schreibt lokal nach `public/uploads`). **Nur neue Dateien** angelegt → keine
  öffentliche Komponente angefasst, Live-Design unverändert.
- **Drive-Import** `scripts/import-drive.ts`: liest eine **lokal gesyncte Drive-Kopie**
  (Kategorie-Ordner → Ziel-Unterordner mit Fotos+`.docx` ODER lose `.docx` im Kategorie-Ordner).
  docx→Text via **mammoth**, HEIC→WebP via **heic-convert + sharp**. Heuristischer Parser:
  „Text im Reel"=Slogan · Caption=Blurb · PLZ→Adresse/Ort · Öffnungszeiten · Preis→Budget
  (**Parkgebühr ≠ Eintritt**) · Kinderwagen (**Negationen** wie „abraten"/„zuhause lassen" beachten).
  **Unsichere Felder LEER lassen — nicht raten** (+ „nachpflegen"-Report). Inhalte liegen NICHT im Repo,
  nur im Google Drive (Owner `allgaeumitkids@gmail.com`); fürs Bulk muss eine lokale Kopie bereitstehen.

## Stehende Regeln (Admin-CMS — IMMER beachten)
- **NIE anfassen:** `components/cover/*`, `lib/cover/*`, `app/admin/cover-preview` — gehören dem
  parallelen **cover-tool**-Job (existieren nur auf Branch `cover-tool`, nicht hier).
- **Cover-Editor (Instagram-artig, mobile-first) = Phase 5**, auf dem cover-tool-Fundament, **erst nach
  dessen Merge nach `main`**: EINE `CoverSpec`, EIN Renderer, EINE Asset-Bibliothek — kein zweiter Renderer.
- **Read-Pfad-Migration = Phase 3** (Hauptrisiko): die ~7 `data.ts`-Direktimporteure auf den Store
  umstellen; byte-identischer Seed → Sarah prüft `/`, `/entdecken`, `/quiz`, `/ausflug/[id]` pixelgleich.
- **Nicht nach origin pushen, solange kein Login** (Phase 2) — kein ungeschützter Admin als
  öffentliches Vercel-Preview.
- Plan: `~/.claude/plans/expressive-frolicking-feigenbaum.md`. Phasen-Status in Memory
  `project_allgaeu_admin_cms` (1✅ Beispiel · 4✅ Import-Prototyp · 2/3/5 offen).

---

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
