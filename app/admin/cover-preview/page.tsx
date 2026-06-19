// app/admin/cover-preview/page.tsx — Read-only-Vorschau: alle Ausflugsziele als
// auto-generierte Cover über die 1:1 Figma-Templates (gute Stil-Mischung).
// Demo-Fotos sind Platzhalter, bis der echte Foto-Import (Drive) steht.
import { FigmaCover } from "@/components/cover/FigmaCover";
import { figmaCoverForDest } from "@/lib/cover/figma-auto";
import { DESTINATIONS } from "@/lib/shapes/data";

export const metadata = { title: "Cover-Vorschau · Admin" };

const demo = (i: number) => `/cover/demo/${String((i % 10) + 1).padStart(2, "0")}.jpg`;

export default function CoverPreviewPage() {
  return (
    <main style={{ padding: "36px clamp(20px,4vw,56px)", background: "#e9e4d6", minHeight: "100vh", fontFamily: "Nunito, system-ui" }}>
      <h1 style={{ fontFamily: "'Baby Mango', system-ui", fontSize: 44, color: "#070e70", marginBottom: 6 }}>Cover-Vorschau</h1>
      <p style={{ color: "#555", marginBottom: 28, maxWidth: 720 }}>
        Jedes Ausflugsziel automatisch als Cover über die 1:1 aus Figma nachgebauten Stile, gut gemischt.
        Slogan = <code>teaser</code>, Stempel = Hauptkategorie. Demo-Fotos sind Platzhalter (echter Foto-Import folgt).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, max-content))", gap: 24 }}>
        {DESTINATIONS.map((d, i) => {
          const { template, content } = figmaCoverForDest(d, i, demo(i));
          return (
            <div key={d.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FigmaCover template={template} content={content} width={260} />
              <div style={{ fontSize: 13, fontWeight: 800, color: "#070e70" }}>
                {d.name} <span style={{ fontWeight: 600, color: "#7a7660" }}>· {template.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
