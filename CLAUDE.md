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
- **Typecheck:** `npx tsc --noEmit` für Logik/Typen. **Visuelle Änderungen (Cover/Layout/UI): SELBST per
  Screenshot gegen die Referenz prüfen, in Schleife bis fehlerfrei** (Sarahs stehende Regel — überschreibt
  „Sarah prüft selbst" für Visuelles). Dev auf 3100, Login im Preview-Browser via Cookie setzen
  (`amk_admin` = SHA-256 von `amk-admin:v1:<ADMIN_PASSWORD>`). Hinweis: Preview-Scroll ist unzuverlässig
  → Kacheln per CSS ausblenden oder `body.style.zoom` statt scrollen.
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
  (alte Interim-CoverSpec, ungenutzt), **`figmaCover`** (`FigmaCoverChoice` = die Cover-Builder-Auswahl,
  jeder Layer optional überschreibbar), `overrides` (Adresse/Öffnung/Preis), `description` (voller
  Reisebericht), `tips`, `published` (Drive-Importe = Entwurf `false`, data.ts-Seed = `true`). `blurb` =
  Kurzfassung. Designsystem-Konstanten (`TYPES/AGES/BUDGETS/…`) bleiben in `lib/shapes/data.ts`.
- **Login-Gate:** `middleware.ts` schützt `/admin/*` (außer `/admin/login`); `lib/auth.ts` leitet ein
  SHA-256-Cookie aus `ADMIN_PASSWORD` ab (läuft in Edge + Node). `app/admin/login/` = Seite + `login`/
  `logout`-Actions.
- **Cover = echtes Vorschaubild (LIVE).** Das Cover-System aus dem cover-tool liegt jetzt hier
  (`lib/cover/*`, `components/cover/*`, `public/cover/*`). `components/content/DestCover.tsx` rendert via
  `lib/content/figma-cover.ts` → `resolveFigmaCover(dest)` das echte **`<FigmaCover>`** (19 pixelgenaue
  Figma-Templates in `lib/cover/figma-templates.ts`, Baby-Mango-Font). **Responsive:** FigmaCover braucht
  eine **numerische** Breite → ResizeObserver misst den Container (CSS `scale(calc(len/zahl))` ist
  UNGÜLTIG — war der ursprüngliche Bug). `resolveFigmaCover` = gespeicherte Builder-Auswahl
  (`dest.figmaCover`) ODER deterministisches Auto-Cover (gewichteter Vorlagen-Mix 3× Vollbild : je 1×
  andere via FNV-Hash `(h>>>16)%8`; Platzhalter `public/cover/demo/figma.png` für fotolose Ziele).
  **`applyOverrides(template, choice)`** transformiert die Layer-Liste für JEDE Editier-Option
  (Fläche/Rahmen/Scrim/Sticker/Marker/Farbbalken/Text-Position) — `FigmaCover` bleibt schlanker Renderer.
- **Cover-Builder** `app/admin/ausflug/[id]/cover/` (`CoverEditor.tsx`, mobile-first, 5 Tabs
  Vorlage·Fläche·Schrift·Grafik·Stempel): jeder Layer editierbar (Foto↔Farbfläche+Farbe, Rahmen-Form,
  Scrim, Brand-Grafiken/Sticker per Drag, Kategorie-Stempel wählen, Schrift mit voller Brand-Palette +
  Farbbalken + Textmarker-Toggle + Drag&Drop + Marker-/Bandarolen-Farbe). Speichert `FigmaCoverChoice`
  (`lib/content/types.ts`) via Server-Action `saveFigmaCover`. **PNG-Export** via `html-to-image`
  (verstecktes 1080×1350-Render). Referenz-Galerien: `/admin/figma-check`, `/admin/cover-preview`.
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
- **Cover-Code lebt jetzt HIER** (`lib/cover/*`, `components/cover/*`, `public/cover/*`, aus cover-tool/
  main geholt) und wird genutzt. ⚠️ **MERGE-HAZARD:** `components/cover/FigmaCover.tsx` +
  `lib/cover/figma-templates.ts` wurden in `admin-cms` **verändert** (Text-Auto-Fit `fitText`/`fitMarker`,
  Override-Felder `fillColor`/`bar`, Umbenennungen, Kontrast-Fixes) → weichen von main/cover-tool ab; bei
  `admin-cms`→`main` bewusst reconcilen.
- **Referenz für die Templates = die NACHGEBAUTEN** in `lib/cover/figma-templates.ts` (Galerie
  `/admin/figma-check`), **NICHT das Live-Figma** (File „Cover / Feed (4:5)" `rglURpXy84rtaZlYuvO4pY`) —
  das ist versehentlich gedriftet (lila-auf-lila-Schrift). figma-templates.ts NICHT „1:1 ans Figma"
  zurückbauen. Umbenannt: Stil17→Teaser 2, Stil20→Teaser 3, Stil19→Rahmen Viereck 3, altes Teaser 2→Zahl 1.
- **Design ist eingefroren:** öffentliche Seiten (`/`, `/entdecken`, `/quiz`, `/ausflug/[id]`) müssen für
  die bestehenden 16 Ziele **pixelgleich** bleiben — neue Abschnitte/Daten nur additiv & konditional.
  Sarahs visueller Gegencheck steht noch aus.
- **Cloud ist live (Branch gepusht):** `admin-cms` ist auf origin → Vercel baut ein **Vorschau-Deployment**
  (Live-Domain `main` unberührt). Neon-Postgres + Blob `allgaeu-fotos` (Public). Nach 6 gelöschten
  Sammel-Docs: **70 Ziele** (16 live · 54 Entwurf). Stabiler Vorschau-Link (Branch-Alias, Vercel-Auth
  ausgeschaltet → für die Schwester öffentlich, Admin per App-Passwort):
  `https://allgaeu-mit-kids-git-admin-cms-allgaeumit-kids.vercel.app` (Website `/` + `/entdecken`, Admin
  `/admin` Passwort `allgaeu2026`). **Merge `admin-cms` → `main` nur bewusst** (mit cover-tool abgestimmt).
- Plan: `~/.claude/plans/expressive-frolicking-feigenbaum.md`. Phasen-Status in Memory
  `project_allgaeu_admin_cms`: 1✅ 2✅ 3✅ 4✅ (Drive-Bulk) · 6/7✅ Cover echt + Platzhalter · 8✅
  (Wegbeschaffenheit→Toggle, Editor zeigt Reisebericht/Tipps) · 9✅ (6 Sammel-Docs gelöscht) · **10
  (Cover-Builder) gebaut — voller Schicht-Editor**. Verbleibt: Sarahs Pixel-Gegencheck, `admin-cms`→`main`.

---

# Allgäu mit Kids — Projekt-Spickzettel

Familien-Ausflugsplattform fürs Allgäu. Next.js 15 · React 19 · Tailwind 4 · TypeScript.

## ⚡ Arbeitsweise mit Sarah (WICHTIG — Tempo!)
- ⚠️ **NEUERE Regel (überschreibt den nächsten Punkt für Visuelles):** Bei **visuellen** Änderungen
  (Cover/Layout/UI) verifiziere ich **selbst per Screenshot** gegen die Referenz, in Schleife bis
  fehlerfrei — erst dann Sarah zeigen. Nur für Nicht-Visuelles reicht `tsc`.
- **Sarah prüft visuell SELBST** auf `localhost:3000` (eigener Browser / DevTools-Mobilansicht) — gilt
  für rein funktionale/strukturelle Dinge. Für Visuelles siehe Punkt oben. Kurze DOM-Checks + `tsc` zum
  Selbstcheck, dann Sarah schauen lassen.
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
