// lib/cover/types.ts — die Cover-"Spec": Inhalt sauber von Stil getrennt.
// Eine Spec → live als Plattform-Card (text-light) ODER Export für Social (text-on).

export type CoverFormat = "feed" | "reel"; // feed 1080×1350 (4:5), reel 1080×1920 (9:16)
export type CoverTemplate = "vollbild" | "blob" | "editorial";
export type CoverMode = "text-on" | "text-light";

// Marken-Palette (aus Figma cover-Tokens) — nur diese Farben sind erlaubt.
export type CoverColor = "ink" | "paper" | "white" | "pink" | "yellow" | "purple" | "orange";

export const COVER_COLORS: Record<CoverColor, string> = {
  ink: "#070e70", paper: "#f7f2e5", white: "#ffffff",
  pink: "#ffa3eb", yellow: "#ffdd00", purple: "#8583e4", orange: "#ff932f",
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
  bg?: CoverColor;         // Hintergrund-Farbfläche (blob / vollbild ohne Foto)
  textColor?: CoverColor;  // Schriftfarbe
  bar?: CoverColor | null; // Farbbalken hinter der Schrift (null = keiner)
  barText?: CoverColor;
  scrim?: boolean;         // Scrim für Lesbarkeit auf Foto
  fontSize?: number;       // px @ 1080 Breite
  showStamp?: boolean;     // Kategorie-Stempel ein/aus
};
