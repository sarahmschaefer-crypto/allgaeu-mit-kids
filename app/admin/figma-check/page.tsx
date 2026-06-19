// TEMP 1:1-Vergleich — meine FigmaCover (links) vs. Figma-Referenz (rechts). Wird gelöscht.
import { FigmaCover, type FigmaContent } from "@/components/cover/FigmaCover";
import { figmaTemplate, type FigmaTemplate } from "@/lib/cover/figma-templates";

const FP = "/cover/demo/figma/vollbild.png";
const W = 340;
const R = (n: string) => `/cover/demo/figma/${n}`;

const rows: { id: string; ref: string; content: FigmaContent }[] = [
  { id: "vollbild-einfach", ref: R("ref_vollbild.png"), content: { photo: FP, slogan: "Wanderweg\nWiesenfeld", place: "Overline zb Ort", stampCategory: "ausflug" } },
  { id: "bandarole-1", ref: R("ref_bandarole1.png"), content: { photo: FP, slogan: "Bergspaß\nfür alle", stampCategory: "ausflug" } },
  { id: "rahmen-viereck-1", ref: R("ref_viereck1.png"), content: { photo: FP, slogan: "Lieblings-\nAusflüge im Allgäu", number: "9", stampCategory: "ausflug" } },
  { id: "teaser-1", ref: R("ref_teaser1.png"), content: { photo: FP, slogan: "Das beste\nAusflugsziel\nbei Regen?", stampCategory: "schwimmen" } },
  { id: "vollbild-grafik-schrift", ref: R("ref_grafik1.png"), content: { photo: FP, slogan: "Raus &\nentdecken", stampCategory: "ausflug" } },
  { id: "rahmen-blob-1", ref: R("ref_blob1.png"), content: { photo: FP, slogan: "Lamaland\nJolerhof", stampCategory: "tierpark" } },
];

export default function FigmaCheck() {
  return (
    <main style={{ padding: 24, background: "#cfcabb", fontFamily: "Nunito", display: "flex", flexDirection: "column", gap: 24 }}>
      {rows.map((r) => {
        const t = figmaTemplate(r.id) as FigmaTemplate;
        return (
          <div key={r.id}>
            <b style={{ color: "#070e70" }}>{t.name}</b>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: 4 }}>
              <div><div style={{ fontSize: 11 }}>MEIN RENDER</div><FigmaCover template={t} content={r.content} width={W} /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div><div style={{ fontSize: 11 }}>FIGMA</div><img src={r.ref} alt="" style={{ width: W, height: W * 1.25, objectFit: "cover", display: "block" }} /></div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
