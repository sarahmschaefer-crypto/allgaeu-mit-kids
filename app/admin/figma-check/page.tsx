// TEMP 1:1-Vergleich — meine FigmaCover (links) vs. Figma-Referenz (rechts). Wird gelöscht.
import { FigmaCover, type FigmaContent } from "@/components/cover/FigmaCover";
import { figmaTemplate, type FigmaTemplate } from "@/lib/cover/figma-templates";

const FP = "/cover/demo/figma/vollbild.png";
const W = 340;
const R = (n: string) => `/cover/demo/figma/${n}`;

const rows: { id: string; ref: string; content: FigmaContent }[] = [
  { id: "vollbild-grafik-schrift-2", ref: R("ref_grafik2.png"), content: { photo: FP, slogan: "Raus &\nentdecken", stampCategory: "ausflug" } },
  { id: "stil16", ref: R("ref_stil16.png"), content: { photo: FP, slogan: "Sommer-\nrodelbahn\nHündle", place: "Overline zb Ort", stampCategory: "attraktion" } },
  { id: "stil17", ref: R("ref_stil17.png"), content: { photo: FP, slogan: "Das beste\nAusflugsziel\nbei Regen?", stampCategory: "schwimmen" } },
  { id: "teaser-2", ref: R("ref_teaser2.png"), content: { photo: FP, slogan: "Sommer-\nrodelbahn\nHündle", number: "9", place: "Overline zb Ort", stampCategory: "schwimmen" } },
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
