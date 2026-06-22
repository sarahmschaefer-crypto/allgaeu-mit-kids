// Galerie aller 1:1 aus Figma nachgebauten Cover/Feed-Templates.
import { FigmaCover, type FigmaContent } from "@/components/cover/FigmaCover";
import { FIGMA_TEMPLATES } from "@/lib/cover/figma-templates";

export const metadata = { title: "Figma-Templates 1:1 · Admin" };

const sample: FigmaContent = {
  photo: "/cover/demo/01.jpg",
  slogan: "Der schönste\nAusflug?",
  place: "Oberstdorf",
  number: "9",
  stampCategory: "ausflug",
};

// Templates mit eigener typischer Beschriftung
const text: Record<string, Partial<FigmaContent>> = {
  "rahmen-viereck-1": { slogan: "Lieblings-\nAusflüge im Allgäu" },
  "rahmen-viereck-2": { slogan: "Lieblings-\nAusflüge im Allgäu" },
  stil19: { slogan: "Lieblings-\nAusflüge im Allgäu" },
  "vollbild-grafik-schrift": { slogan: "Raus &\nentdecken" },
  "vollbild-grafik-schrift-2": { slogan: "Raus &\nentdecken" },
  "vollbild-grafik-schrift-3": { slogan: "Funtastico\nIndoor", stampCategory: "spielplatz" },
  "vollbild-grafik-schrift-4": { slogan: "Funtastico\nIndoor", stampCategory: "spielplatz" },
  "textmarker-1": { slogan: "Sommer-\nrodelbahn\nHündle", stampCategory: "attraktion" },
  "textmarker-2": { slogan: "Sommer-\nrodelbahn\nHündle", stampCategory: "attraktion" },
  stil16: { slogan: "Sommer-\nrodelbahn\nHündle", stampCategory: "attraktion" },
  "teaser-1": { slogan: "Das beste\nAusflugsziel\nbei Regen?", stampCategory: "schwimmen" },
  "teaser-2": { slogan: "Sommer-\nrodelbahn\nHündle", stampCategory: "schwimmen" },
  stil17: { slogan: "Das beste\nAusflugsziel\nbei Regen?", stampCategory: "schwimmen" },
  stil20: { slogan: "Das beste\nAusflugsziel\nbei Regen?", stampCategory: "schwimmen" },
  "rahmen-blob-1": { slogan: "Lamaland\nJolerhof", stampCategory: "tierpark" },
  "rahmen-blob-3": { slogan: "Lamaland\nJolerhof", stampCategory: "tierpark" },
};

export default function FigmaTemplatesGallery() {
  return (
    <main style={{ padding: "32px clamp(20px,4vw,56px)", background: "#e9e4d6", minHeight: "100vh", fontFamily: "Nunito, system-ui" }}>
      <h1 style={{ fontFamily: "'Baby Mango', system-ui", fontSize: 44, color: "#070e70" }}>Figma-Templates 1:1</h1>
      <p style={{ color: "#555", marginBottom: 28 }}>Alle {FIGMA_TEMPLATES.length} Stile aus „Cover / Feed (4:5)" pixelgenau nachgebaut.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, max-content))", gap: 24 }}>
        {FIGMA_TEMPLATES.map((t) => (
          <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <FigmaCover template={t} content={{ ...sample, ...text[t.id] }} width={260} />
            <div style={{ fontSize: 13, fontWeight: 800, color: "#070e70" }}>{t.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
