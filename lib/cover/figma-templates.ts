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
  bar?: CoverColor | "white";       // optionaler Farbbalken hinter dem Text (Editor)
};
export type FTPhoto = {
  type: "photo"; x: number; y: number; w: number; h: number;
  radius?: [number, number, number, number]; // tl, tr, br, bl
  mask?: string;   // Blob-SVG als Foto-Maske (z.B. "blob1")
  rot?: number;    // Rotation in Grad
  scrim?: { y: number; h: number; to: number };
  fillColor?: CoverColor | "white"; // Farbfläche statt Foto (Editor)
};
// Textmarker: jede Slogan-Zeile auf eigenem Highlight-Balken (auto-Breite).
export type FTMarker = {
  type: "marker"; x: number; y: number; gap: number; size: number;
  barColor: CoverColor; textColor: CoverColor;
  pad: [number, number, number, number]; radius: number; tracking: number;
  align?: "left" | "center"; w?: number;
};
export type FTBand = { type: "band"; color: CoverColor; x: number; y: number; w: number; h: number };
export type FTStamp = { type: "stamp"; x: number; y: number; size: number };
export type FTGraphic = { type: "graphic"; asset: string; x: number; y: number; w: number; h?: number; rot?: number };
export type FTLayer = FTText | FTPhoto | FTBand | FTStamp | FTGraphic | FTMarker;

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
      { type: "text", field: "slogan", x: 60, y: 190, w: 960, size: 156, color: "ink", font: "mango", lh: 0.92, tracking: -1.56, align: "center" },
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
      { type: "text", field: "slogan", x: 60, y: 940, w: 960, size: 156, color: "white", font: "mango", lh: 0.92, tracking: -1.56 },
      { type: "graphic", asset: "spots", x: 747, y: 972, w: 242 },
    ],
  },
);

FIGMA_TEMPLATES.push(
  {
    id: "rahmen-viereck-2", name: "Rahmen Viereck 2", bg: "yellow", needs: { number: true },
    layers: [
      { type: "photo", x: 60, y: 60, w: 960, h: 792, radius: [40, 80, 40, 40] },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "number", x: 83, y: 675, w: 861, size: 360, color: "pink", font: "mango", lh: 0.92, tracking: -3.6 },
      { type: "text", field: "slogan", x: 60, y: 970, w: 960, size: 120, color: "white", font: "mango", lh: 0.92, tracking: -1.2 },
      { type: "graphic", asset: "spots", x: 748, y: 926, w: 225 },
    ],
  },
  {
    id: "rahmen-blob-3", name: "Rahmen Blob 3", bg: "pink",
    layers: [
      { type: "photo", x: 60, y: 60, w: 960, h: 943, radius: [460, 460, 460, 460] },
      { type: "text", field: "slogan", x: 60, y: 1003, w: 960, size: 156, color: "ink", font: "mango", lh: 0.92, tracking: -1.56 },
      { type: "stamp", x: 868, y: 60, size: 152 },
    ],
  },
  {
    id: "textmarker-1", name: "Textmarker 1",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350 },
      { type: "graphic", asset: "path", x: 61, y: -46, w: 421, h: 895, rot: 47.32 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "marker", x: 60, y: 820, gap: 12, size: 100, barColor: "purple", textColor: "pink", pad: [10, 24, 12, 24], radius: 14, tracking: -1 },
    ],
  },
);

FIGMA_TEMPLATES.push(
  {
    id: "vollbild-grafik-schrift-2", name: "Vollbild Grafik & Schrift 2",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350, scrim: { y: 710, h: 640, to: 0.88 } },
      { type: "graphic", asset: "path", x: 61, y: -46, w: 421, h: 895, rot: 47.32 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 900, w: 960, size: 156, color: "white", font: "mango", lh: 0.92, tracking: -1.56 },
    ],
  },
  {
    id: "stil16", name: "Stil16",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350 },
      { type: "text", field: "overline", x: 79, y: 729, size: 41.5, color: "white", font: "nunito", lh: 1, tracking: 6.64, upper: true, weight: 700 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "marker", x: 60, y: 820, gap: 12, size: 100, barColor: "yellow", textColor: "ink", pad: [10, 24, 12, 24], radius: 14, tracking: -1 },
    ],
  },
  {
    id: "stil17", name: "Teaser 2", bg: "orange",
    layers: [
      { type: "text", field: "slogan", x: 60, y: 230, w: 960, size: 132, color: "ink", font: "mango", lh: 0.92, tracking: -1.32, align: "center" },
      { type: "graphic", asset: "logo-bade", x: 314, y: 660, w: 451 },
      { type: "stamp", x: 868, y: 60, size: 152 },
    ],
  },
  {
    id: "teaser-2", name: "Zahl 1", bg: "pink", needs: { number: true },
    layers: [
      { type: "graphic", asset: "footprints", x: 116, y: 128, w: 296, h: 410 },
      { type: "text", value: "9", x: 331, y: 245, w: 418, size: 300, color: "orange", font: "mango", lh: 0.92, tracking: -3, align: "center" },
      { type: "marker", x: 0, y: 540, w: 1080, align: "center", gap: 12, size: 100, barColor: "yellow", textColor: "ink", pad: [10, 24, 12, 24], radius: 14, tracking: -1 },
      { type: "text", field: "overline", x: 0, y: 1048, w: 1080, size: 41.5, color: "white", font: "nunito", lh: 1, tracking: 6.64, upper: true, weight: 700, align: "center" },
      { type: "stamp", x: 868, y: 60, size: 152 },
    ],
  },
);

FIGMA_TEMPLATES.push(
  {
    id: "stil19", name: "Rahmen Viereck 3", bg: "purple", needs: { number: true },
    layers: [
      { type: "photo", x: 60, y: 60, w: 960, h: 792, radius: [40, 80, 40, 40] },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "number", x: 83, y: 675, w: 861, size: 360, color: "pink", font: "mango", lh: 0.92, tracking: -3.6 },
      { type: "text", field: "slogan", x: 60, y: 970, w: 960, size: 120, color: "white", font: "mango", lh: 0.92, tracking: -1.2 },
    ],
  },
  {
    id: "stil20", name: "Teaser 3", bg: "purple",
    layers: [
      { type: "text", field: "slogan", x: 60, y: 230, w: 960, size: 132, color: "yellow", font: "mango", lh: 0.92, tracking: -1.32, align: "center" },
      { type: "graphic", asset: "logo-bade", x: 314, y: 660, w: 451 },
      { type: "stamp", x: 868, y: 60, size: 152 },
    ],
  },
  {
    id: "textmarker-2", name: "Textmarker 2",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350 },
      { type: "graphic", asset: "footprints", x: 106, y: 76, w: 296, h: 410 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "marker", x: 60, y: 820, gap: 12, size: 100, barColor: "orange", textColor: "white", pad: [10, 24, 12, 24], radius: 14, tracking: -1 },
    ],
  },
  {
    id: "vollbild-grafik-schrift-3", name: "Vollbild Grafik & Schrift 3",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350 },
      { type: "graphic", asset: "blob3", x: 107, y: 838, w: 324 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 940, w: 960, size: 156, color: "paper", font: "mango", lh: 0.92, tracking: -1.56 },
    ],
  },
  {
    id: "vollbild-grafik-schrift-4", name: "Vollbild Grafik & Schrift 4",
    layers: [
      { type: "photo", x: 0, y: 0, w: 1080, h: 1350 },
      { type: "graphic", asset: "logo-bade", x: 314, y: 359, w: 451 },
      { type: "stamp", x: 868, y: 60, size: 152 },
      { type: "text", field: "slogan", x: 60, y: 940, w: 960, size: 156, color: "paper", font: "mango", lh: 0.92, tracking: -1.56, align: "center" },
    ],
  },
);

export const figmaTemplate = (id: string) => FIGMA_TEMPLATES.find((t) => t.id === id);
