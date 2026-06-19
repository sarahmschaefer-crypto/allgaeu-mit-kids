// lib/cover/figma-auto.ts — Auto-Generierung: ein Ausflugsziel → ein Figma-Cover.
// Verteilt über die foto-basierten Stile (gute Mischung), Inhalt aus dem Ziel.
// Read-only-Vorschau; der eigentliche Editor entsteht im Admin-Panel.
import { primaryTagOf, type ShapesDest } from "@/lib/shapes/data";
import { FIGMA_TEMPLATES, type FigmaTemplate } from "./figma-templates";
import type { FigmaContent } from "@/components/cover/FigmaCover";

// Zahl-/Listen-Templates (brauchen eine Nummer) gehören zu Sammlungen, nicht zu
// einzelnen Zielen → für die Ziel-Mischung ausschließen.
export const PHOTO_TEMPLATES: FigmaTemplate[] = FIGMA_TEMPLATES.filter((t) => !t.needs?.number);

// Hat das Template gestapelte Marker-Balken? Dann Slogan in Wörter/Zeilen brechen.
const hasMarker = (t: FigmaTemplate) => t.layers.some((l) => l.type === "marker");

export function figmaCoverForDest(
  dest: ShapesDest,
  index: number,
  photo?: string,
): { template: FigmaTemplate; content: FigmaContent } {
  const template = PHOTO_TEMPLATES[index % PHOTO_TEMPLATES.length];
  const teaser = dest.teaser ?? dest.highlights?.[0] ?? dest.name;
  const slogan = hasMarker(template) ? teaser.split(" ").join("\n") : teaser;
  return {
    template,
    content: {
      photo,
      slogan,
      place: dest.place,
      stampCategory: primaryTagOf(dest),
      number: "9",
    },
  };
}
