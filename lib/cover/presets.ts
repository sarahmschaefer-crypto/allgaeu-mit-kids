// lib/cover/presets.ts — Auto-Generierung: aus einem Ausflugsziel einen
// Cover-Entwurf bauen. Slogan = teaser (sonst KI später), Stempel = primaryTag,
// Template-Mix ~3:1 (Vollbild : Blob/Editorial). Alles danach im Editor änderbar.

import type { ShapesDest } from "@/lib/shapes/data";
import { primaryTagOf } from "@/lib/shapes/data";
import type { CoverColor, CoverFormat, CoverMode, CoverSpec, CoverTemplate } from "./types";

// stabiler kleiner Hash aus der ID → deterministische, aber gestreute Auswahl
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const BLOB_BG: CoverColor[] = ["orange", "purple", "pink"];
const BLOB_TEXT: CoverColor[] = ["purple", "yellow", "ink"];
const BAR_COLORS: CoverColor[] = ["yellow", "pink", "purple"];

// Template-Verteilung ~3:1 (Vollbild : Rahmen). h%4: 0–2 Vollbild, 3 Blob/Editorial
function pickTemplate(h: number): CoverTemplate {
  const m = h % 8;
  if (m === 3) return "blob";
  if (m === 7) return "editorial";
  return "vollbild";
}

export type CoverOverrides = Partial<CoverSpec> & {
  format?: CoverFormat;
  mode?: CoverMode;
  photo?: string;
};

export function coverFromDest(dest: ShapesDest, o: CoverOverrides = {}): CoverSpec {
  const h = hash(dest.id);
  const template = o.template ?? pickTemplate(h);
  const category = o.category ?? primaryTagOf(dest);
  const base: CoverSpec = {
    format: o.format ?? "feed",
    template,
    mode: o.mode ?? "text-on",
    category,
    slogan: o.slogan ?? dest.teaser ?? dest.highlights?.[0] ?? "Familienausflug",
    place: o.place ?? dest.place,
    photo: o.photo,
    showStamp: o.showStamp ?? true,
  };

  if (template === "blob") {
    base.bg = o.bg ?? BLOB_BG[h % BLOB_BG.length];
    base.textColor = o.textColor ?? BLOB_TEXT[h % BLOB_TEXT.length];
  } else if (template === "editorial") {
    base.bg = "paper";
    base.textColor = o.textColor ?? "ink";
  } else {
    // vollbild: jedes 3. bekommt einen Farbbalken statt Scrim
    const withBar = h % 3 === 0;
    if (withBar && base.photo) {
      base.bar = o.bar ?? BAR_COLORS[h % BAR_COLORS.length];
      base.barText = base.bar === "yellow" ? "ink" : "ink";
      base.textColor = o.textColor ?? "ink";
    } else {
      base.scrim = true;
      base.textColor = o.textColor ?? "white";
    }
    // ohne Foto: Farbfläche als Hintergrund
    if (!base.photo) {
      base.bg = o.bg ?? (["purple", "orange", "ink"] as CoverColor[])[h % 3];
      base.textColor = o.textColor ?? "white";
      base.scrim = false;
      base.bar = null;
    }
  }
  return { ...base, ...stripUndefined(o) };
}

// flache Overrides anwenden, ohne mit undefined zu überschreiben
function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k in o) if (o[k] !== undefined) out[k] = o[k];
  return out;
}
