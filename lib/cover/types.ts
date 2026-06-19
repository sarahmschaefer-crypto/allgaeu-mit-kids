// lib/cover/types.ts — die Cover-"Spec": Inhalt sauber von Stil getrennt.
// Eine Spec → live als Plattform-Card (text-light) ODER Export für Social (text-on).

export type CoverFormat = "feed" | "reel"; // feed 1080×1350 (4:5), reel 1080×1920 (9:16)
export type CoverTemplate =
  | "vollbild"        // Foto vollflächig + Text
  | "blob"            // Farbfläche + Foto in organischer Form
  | "editorial"       // Paper + Foto-Rahmen + Text oben
  | "split-band"      // Foto oben + Farbband unten, Text über der Kante
  | "farbrahmen"      // Foto mit dickem Farb-Rahmen
  | "foto-untertitel" // Foto + gestapelte Farb-Untertitel-Balken
  | "frage"           // Farbfläche + Frage + Logo (kein Foto)
  | "marker-bogen";   // Foto + organische Formen + Logo
export type CoverMode = "text-on" | "text-light";

// Marken-Palette (aus Figma cover-Tokens) — nur diese Farben sind erlaubt.
export type CoverColor = "ink" | "paper" | "white" | "pink" | "yellow" | "purple" | "orange";

export const COVER_COLORS: Record<CoverColor, string> = {
  ink: "#070e70", paper: "#f7f2e5", white: "#ffffff",
  pink: "#ffa3eb", yellow: "#ffdd00", purple: "#8583e4", orange: "#ff932f",
};

// Brand-Grafiken, die als Sticker aufs Cover gesetzt werden können (Editor-Palette).
export type CoverGraphic = "logo" | "logo-bade" | "spots" | "footprints" | "path" | "blob1" | "blob2" | "blob3" | "blob4";
export const COVER_GRAPHICS: CoverGraphic[] = ["logo", "logo-bade", "spots", "footprints", "path", "blob1", "blob2", "blob3", "blob4"];

// Ein platziertes grafisches Element (Position 0..1 relativ zur Cover-Fläche).
export type CoverSticker = {
  asset: CoverGraphic;
  x: number;         // 0..1 (Mittelpunkt)
  y: number;         // 0..1 (Mittelpunkt)
  scale: number;     // Breite relativ zur Cover-Breite (0.3 = 30%)
  rotation?: number; // Grad
};

export type CoverSpec = {
  format: CoverFormat;
  template: CoverTemplate;
  mode: CoverMode;
  category: string;        // Kategorie-ID (→ Stempel + TYPES)
  slogan: string;          // Werbeschrift / Claim
  place?: string;          // Ort (Eyebrow)
  photo?: string;          // Foto-URL; fehlt → Farbfläche
  focal?: { x: number; y: number }; // 0..1 Fokuspunkt fürs Foto
  // Stil
  bg?: CoverColor;         // Hintergrund-Farbfläche
  band?: CoverColor;       // Farbband (split-band) / Rahmenfarbe (farbrahmen)
  textColor?: CoverColor;  // Schriftfarbe (BUNT!)
  bar?: CoverColor | null; // Farbbalken hinter der Schrift (null = keiner)
  barText?: CoverColor;
  subtitleBars?: CoverColor[]; // gestapelte Untertitel-Balken (foto-untertitel)
  scrim?: boolean;         // Scrim für Lesbarkeit auf Foto
  fontSize?: number;       // px @ 1080 Breite
  showStamp?: boolean;     // Kategorie-Stempel ein/aus
  showLogo?: boolean;      // Marken-Logo (frage / marker-bogen)
  number?: string;         // große Zahl (Listen-Cover)
  stickers?: CoverSticker[]; // frei platzierte Brand-Grafiken (Ebene 4)
};
