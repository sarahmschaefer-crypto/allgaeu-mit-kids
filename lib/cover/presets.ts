// lib/cover/presets.ts — Auto-Generierung mit GUTER MISCHUNG aller Template-Typen
// und BUNTER Schrift (Brand-Farben). Slogan = teaser (sonst KI später),
// Stempel = primaryTag. Alles danach im Editor änderbar.

import type { ShapesDest } from "@/lib/shapes/data";
import { primaryTagOf } from "@/lib/shapes/data";
import type { CoverColor, CoverFormat, CoverMode, CoverSpec, CoverTemplate } from "./types";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Reihenfolge so, dass über die Ziele alle Typen durchrotieren → gute Mischung.
const CYCLE: CoverTemplate[] = [
  "vollbild", "split-band", "blob", "farbrahmen",
  "editorial", "foto-untertitel", "marker-bogen", "frage",
];

export type CoverOverrides = Partial<CoverSpec> & {
  format?: CoverFormat;
  mode?: CoverMode;
  photo?: string;
  variantIndex?: number; // erzwingt die Mischung (z.B. Listen-Index)
};

// Bunte Farbwege je Template — i streut die Farben.
function styleFor(t: CoverTemplate, i: number, hasPhoto: boolean): Partial<CoverSpec> {
  const r3 = i % 3, r4 = i % 4;
  switch (t) {
    case "vollbild":
      // bunte Schrift auf schwarzem Scrim, ab und zu Farbbalken
      if (r3 === 0) return { scrim: false, bar: (["yellow", "pink", "purple"] as CoverColor[])[i % 3], barText: "ink", textColor: "ink" };
      return { scrim: true, textColor: (["yellow", "pink", "white"] as CoverColor[])[r3 % 3] };
    case "split-band": {
      const band = (["purple", "orange", "pink", "ink"] as CoverColor[])[r4];
      const text = ({ purple: "yellow", orange: "white", pink: "ink", ink: "yellow" } as Record<string, CoverColor>)[band];
      return { band, textColor: text };
    }
    case "blob": {
      const bg = (["orange", "purple", "pink"] as CoverColor[])[r3];
      const text = ({ orange: "purple", purple: "yellow", pink: "ink" } as Record<string, CoverColor>)[bg];
      return { bg, textColor: text };
    }
    case "farbrahmen": {
      const band = (["purple", "orange", "pink"] as CoverColor[])[r3];
      return { band, bg: band, textColor: "white" };
    }
    case "editorial":
      return { bg: "paper", textColor: (["orange", "purple", "pink"] as CoverColor[])[r3] };
    case "foto-untertitel":
      return { subtitleBars: r3 === 0 ? ["yellow", "purple"] : r3 === 1 ? ["pink", "yellow"] : ["purple", "orange"], textColor: "ink" };
    case "marker-bogen":
      return { bg: (["purple", "orange", "pink"] as CoverColor[])[r3], textColor: "paper", showLogo: true };
    case "frage": {
      const bg = (["pink", "purple", "yellow"] as CoverColor[])[r3];
      const text = ({ pink: "yellow", purple: "yellow", yellow: "ink" } as Record<string, CoverColor>)[bg];
      return { bg, textColor: text, showLogo: true };
    }
    default:
      return {};
  }
}

export function coverFromDest(dest: ShapesDest, o: CoverOverrides = {}): CoverSpec {
  const h = hash(dest.id);
  const i = o.variantIndex ?? h;
  const template = o.template ?? CYCLE[i % CYCLE.length];
  const photo = o.photo;
  const style = styleFor(template, i, !!photo);

  const base: CoverSpec = {
    format: o.format ?? "feed",
    template,
    mode: o.mode ?? "text-on",
    category: o.category ?? primaryTagOf(dest),
    slogan: o.slogan ?? dest.teaser ?? dest.highlights?.[0] ?? "Familienausflug",
    place: o.place ?? dest.place,
    photo,
    showStamp: o.showStamp ?? true,
    ...style,
  };

  return { ...base, ...stripUndefined(o) };
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k in o) if (o[k] !== undefined && k !== "variantIndex") out[k] = o[k];
  return out;
}
