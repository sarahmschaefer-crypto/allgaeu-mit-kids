// TEMP 1:1-Vergleich — meine FigmaCover (links) vs. Figma-Referenz (rechts). Wird gelöscht.
import { FigmaCover, type FigmaContent } from "@/components/cover/FigmaCover";
import { figmaTemplate, type FigmaTemplate } from "@/lib/cover/figma-templates";

const FP = "/cover/demo/figma/vollbild.png";
const W = 340;
const R = (n: string) => `/cover/demo/figma/${n}`;

const rows: { id: string; ref: string; content: FigmaContent }[] = [
  { id: "rahmen-viereck-2", ref: R("ref_viereck2.png"), content: { photo: FP, slogan: "Lieblings-\nAusflüge im Allgäu", number: "9", stampCategory: "ausflug" } },
  { id: "rahmen-blob-2", ref: R("ref_blob2.png"), content: { photo: FP, slogan: "", place: "Overline zb Ort", stampCategory: "schwimmen" } },
  { id: "rahmen-blob-3", ref: R("ref_blob3.png"), content: { photo: FP, slogan: "Lamaland\nJolerhof", stampCategory: "tierpark" } },
  { id: "textmarker-1", ref: R("ref_textmarker1.png"), content: { photo: FP, slogan: "Sommer-\nrodelbahn\nHündle", stampCategory: "attraktion" } },
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
