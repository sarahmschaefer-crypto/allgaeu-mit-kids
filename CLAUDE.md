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
  ⚠️ Der Datei-Store cached im Speicher: nach externem Schreiben (Import-Skript) Dev-Server **neu starten**.
- **Login lokal:** `ADMIN_PASSWORD` in `.env.local` (Dev: `allgaeu2026`). Login-Token = SHA-256 davon.
  Ohne Variable: in `development` offen, in `production` gesperrt.
- **Typecheck:** `npx tsc --noEmit` (Hauptverifikation; Preview-Server meiden).
- **Drive-Import:** `npx tsx scripts/import-drive.ts <lokaler-ordner>` (z. B. `~/Downloads/"Relevant für App"`).
- **Cloud-Migration (einmalig, erledigt):** `npx tsx scripts/migrate-to-cloud.ts` lädt `data/content.json`
  → Postgres und lokale `public/uploads`-Fotos → Blob (URLs umgeschrieben); Creds aus `.env.local`.
- **Cloud-Env:** `POSTGRES_URL` → Store nutzt Postgres statt Datei · `BLOB_READ_WRITE_TOKEN` → Uploads →
  Vercel Blob statt `public/uploads` · `ADMIN_PASSWORD` → Login. ⚠️ Stehen diese in `.env.local`, geht
  auch der **lokale `dev` auf die Cloud-DB/Blob** (nicht auf die lokale Datei).

## Architektur (was mehrere Dateien überspannt)
- **Daten-Store hinter schmalem Interface** `lib/content/store.ts` (Funktionen `getAllDests/
  getContentDest/updateDest/deleteDest/createDest`). **Backend per Env:** `POSTGRES_URL` gesetzt →
  `lib/content/store-pg.ts` (Vercel Postgres, EINE Tabelle `destinations(id, sort, data jsonb)`), sonst
  JSON-Datei `data/content.json` (gitignored, **seedet aus `lib/shapes/data.ts`**). Verbraucher kennen
  nur das Interface.
- **`ContentDest`** (`lib/content/types.ts`) = **Superset von `ShapesDest`** + `photos`, `cover`
  (CoverSpec), `overrides` (Adresse/Öffnung/Preis), `description` (voller Reisebericht), `tips`,
  `published` (Drive-Importe = Entwurf `false`, data.ts-Seed = `true`). `blurb` = Kurzfassung.
  Designsystem-Konstanten (`TYPES/AGES/BUDGETS/…`) bleiben in `lib/shapes/data.ts`.
- **Login-Gate:** `middleware.ts` schützt `/admin/*` (außer `/admin/login`); `lib/auth.ts` leitet ein
  SHA-256-Cookie aus `ADMIN_PASSWORD` ab (läuft in Edge + Node). `app/admin/login/` = Seite + `login`/
  `logout`-Actions.
- **Cover = Vorschaubild.** Interim-Renderer `components/content/DestPreview.tsx` rendert die CoverSpec
  (Schichten hinten→vorn: Foto/Farbe · Scrim · Slogan + optional Farbbalken · Kategorie-Stempel oben
  rechts; Playfair statt Baby Mango). Wird in **Phase 5 durch den echten `<Cover>`-Renderer** (Branch
  cover-tool) als Drop-in ersetzt.
- **Admin** unter `app/admin/`: Shell (`layout.tsx` + gescoptes `admin.css`, Logout) · Liste
  (`page.tsx` Server + `AdminList.tsx` Client = Suche + Live/Entwurf-Filter, „+ Neues Ziel"-Formular) ·
  Editor (`ausflug/[id]/page.tsx` lädt, `Editor.tsx` Client-Form mit Live-Cover-Vorschau,
  Veröffentlicht-Schalter, Foto-Upload, „Auf der Website ansehen"-Link, Löschen). **Server-Actions**
  `app/admin/actions.ts`: `saveDest` (JSON-Payload aus Hidden-Feld), `createDest`, `uploadPhoto`
  (**env-gesteuert** Blob/lokal), `deleteDest` — alle rufen `revalidatePath('/', 'layout')` → öffentliche
  Seiten ohne Redeploy aktuell.
- **Öffentlicher Lese-Pfad (Phase 3):** `lib/content/public.ts` `getPublicDests()` = nur `published`.
  Root-`ContentProvider`/`useDests()` (`app/layout.tsx` async → Seiten dynamisch); `filterDests`/`getDest`
  in `lib/shapes/data.ts` nehmen optionalen Datensatz (Default = Seed). Verbraucher umgestellt:
  ExploreView, MatchContext, SammelnTeaser, QuizFlow, Sammelalbum. **Detail-View** `app/ausflug/[id]`
  (`force-dynamic`): liest Store, additiv Reisebericht (`description`) + „Gut zu wissen" (`tips`) + echte
  Foto-Galerie (`DetailGallery photos`-Prop) + `overrides`-Fakten — neue Abschnitte nur bei Inhalt →
  16 Seeds pixelgleich. **Entwürfe öffentlich → 404**, eingeloggte Redaktion sieht sie als Vorschau (Cookie-Check).
- **Drive-Import** `scripts/import-drive.ts`: liest eine **lokal gesyncte Drive-Kopie**
  (Kategorie-Ordner → Ziel-Unterordner mit Fotos+`.docx` ODER lose `.docx`). docx→Text via **mammoth**,
  HEIC→WebP via **heic-convert + sharp**. Heuristischer Parser: „Text im Reel"=Slogan · voller
  Prosa-Körper=`description` (Marker-Präfixe entfernt) · 1. Satz=`blurb` · Rest-Hinweise=`tips` ·
  PLZ→Adresse/Ort · Öffnungszeiten · Preis→Budget (**Parkgebühr ≠ Eintritt**) · Kinderwagen
  (**Negationen** „abraten"/„zuhause lassen" beachten). **Unsichere Felder LEER — nicht raten**
  (+ „nachpflegen"-Report). Importe sind Entwürfe. Inhalte liegen NICHT im Repo, nur im Google Drive
  (Owner `allgaeumitkids@gmail.com`) → lokale Kopie nötig.

## Stehende Regeln (Admin-CMS — IMMER beachten)
- **NIE anfassen:** `components/cover/*`, `lib/cover/*`, `app/admin/cover-preview` — gehören dem
  parallelen **cover-tool**-Job (existieren nur auf Branch `cover-tool`, nicht hier).
- **Cover-Editor (Instagram-artig, mobile-first) = Phase 5**, auf dem cover-tool-Fundament, **erst nach
  dessen Merge nach `main`**: EINE `CoverSpec`, EIN Renderer, EINE Asset-Bibliothek — kein zweiter Renderer.
- **Design ist eingefroren:** öffentliche Seiten (`/`, `/entdecken`, `/quiz`, `/ausflug/[id]`) müssen für
  die bestehenden 16 Ziele **pixelgleich** bleiben — neue Abschnitte/Daten nur additiv & konditional.
  Sarahs visueller Gegencheck steht noch aus.
- **Cloud ist live (Branch gepusht):** `admin-cms` ist auf origin → Vercel baut ein **Vorschau-Deployment**
  (eigene URL, Live-Domain `main` unberührt). Neon-Postgres + Blob `allgaeu-fotos` (Public) angelegt &
  migriert (76 Ziele/74 Fotos). **Merge `admin-cms` → `main` (= echte Live-Domain) nur bewusst** und mit
  dem cover-tool-Job abgestimmt.
- Plan: `~/.claude/plans/expressive-frolicking-feigenbaum.md`. Phasen-Status in Memory
  `project_allgaeu_admin_cms` (1✅ · 3✅ · 4✅ Drive-Bulk 76/74 · 2✅ Cloud live/Vorschau · 5 offen:
  Cover-Editor nach cover-tool→main-Merge). Offen: `ADMIN_PASSWORD` in Vercel + Vorschau-Login testen.

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
