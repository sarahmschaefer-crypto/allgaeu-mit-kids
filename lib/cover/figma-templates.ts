// lib/cover/figma-templates.ts — 1:1-Abbild der Figma-Stile aus
// "Cover / Feed (4:5)" (File rglURpXy84rtaZlYuvO4pY). Werte verbatim aus
// get_design_context (Position/Größe/Font/Farbe/Scrim in px @ 1080×1350).
import type { CoverColor } from "./types";

export type FTField = "slogan" | "overline" | "number" | "subtitle";
export type FTFont = "mango" | "nunito";

export type FTText = {
  type: "text"; field?: FTField; value?: string;
  x: number; y: number; w?: number;
  size: number; color: CoverColor | "white"; font: FTFont;
  lh: number; tracking: number;     // tracking in px @ Originalgröße
  align?: "left" | "center"; upper?: boolean; weight?: number;
};
export type FTPhoto = {
  type: "photo"; x: number; y: number; w: number; h: number;
  radius?: [number, number, number, number]; // tl, tr, br, bl
  mask?: string;   // Blob-SVG als Foto-Maske (z.B. "blob1")
  scrim?: { y: number; h: number; to: number };
};
export type FTBand = { type: "band"; color: CoverColor; x: number; y: number; w: number; h: number };
export type FTStamp = { type: "stamp"; x: number; y: number; size: number };
export type FTGraphic = { type: "graphic"; asset: string; x: number; y: number; w: number; h?: number; rot?: number };
export type FTLayer = FTText | FTPhoto | FTBand | FTStamp | FTGraphic;

export type FigmaTemplate = {
  id: string; name: string; bg?: CoverColor;
  needs?: { number?: boolean };  // datengetrieben (z.B. Listen-Zahl)
  layers: FTLayer[];
};

export const FIGMA_TEMPLATES: FigmaTemplate[] = [
  {
    id: "vollbild-einfach", name: "Vollbild Einfach",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350, scrim: { y: 710, h: 640, to: 0.88 } },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "overline", x: 79, y: 914, size: 41.5, color: "white", font: "nunito", lh: 1, tracking: 6.64, upper: true, weight: 700 },
      { type: "text", field: "slogan", x: 60, y: 1040, w: 960, size: 120, color: "white", font: "mango", lh: 0.92, tracking: -1.2 },
    ],
  },
  {
    id: "bandarole-1", name: "Bandarole 1", bg: "yellow",
    layers: [
      { type: "photo", x: 0, y: 391, w: 1080, h: 959 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 190, w: 960, size: 156, color: "purple", font: "mango", lh: 0.92, tracking: -1.56, align: "center" },
    ],
  },
  {
    id: "bandarole-2", name: "Bandarole 2", bg: "purple",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 940, scrim: { y: 710, h: 640, to: 0.88 } },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 771, w: 960, size: 156, color: "yellow", font: "mango", lh: 0.92, tracking: -1.56 },
    ],
  },
  {
    id: "rahmen-viereck-1", name: "Rahmen Viereck 1", bg: "orange", needs: { number: true },
    layers: [
      { type: "photo", x: 60, y: 60, w: 960, h: 792, radius: [40, 80, 40, 40] },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "number", x: 83, y: 675, w: 861, size: 360, color: "pink", font: "mango", lh: 0.92, tracking: -3.6 },
      { type: "text", field: "slogan", x: 60, y: 970, w: 960, size: 120, color: "white", font: "mango", lh: 0.92, tracking: -1.2 },
    ],
  },
];

FIGMA_TEMPLATES.push(
  {
    id: "teaser-1", name: "Teaser 1", bg: "pink",
    layers: [
      { type: "text", field: "slogan", x: 60, y: 230, w: 960, size: 132, color: "yellow", font: "mango", lh: 0.92, tracking: -1.32, align: "center" },
      { type: "graphic", asset: "logo-bade", x: 314, y: 660, w: 451 },
      { type: "stamp", x: 868, y: 60, size: 152 },
    ],
  },
  {
    id: "vollbild-grafik-schrift", name: "Vollbild Grafik & Schrift",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350, scrim: { y: 710, h: 640, to: 0.88 } },
      { type: "graphic", asset: "footprints", x: 73, y: 34, w: 446, h: 617 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 900, w: 960, size: 156, color: "white", font: "mango", lh: 0.92, tracking: -1.56 },
    ],
  },
  {
    id: "rahmen-blob-1", name: "Rahmen Blob 1", bg: "orange",
    layers: [
      { type: "photo", x: 60, y: 103, w: 960, h: 954, mask: "blob1" },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 940, w: 960, size: 156, color: "purple", font: "mango", lh: 0.92, tracking: -1.56 },
      { type: "graphic", asset: "spots", x: 747, y: 972, w: 242 },
    ],
  },
);

export const figmaTemplate = (id: string) => FIGMA_TEMPLATES.find((t) => t.id === id);
