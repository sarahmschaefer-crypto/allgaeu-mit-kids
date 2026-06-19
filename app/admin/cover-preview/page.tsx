// app/admin/cover-preview/page.tsx — Live-Vorschau des Cover-Renderers.
// Feed (text-on, gemischte Templates), Plattform-Cards (text-light),
// Reels mit Safe-Zone und eine Demo mit platzierten Brand-Grafiken.
import { Cover } from "@/components/cover/Cover";
import { coverFromDest } from "@/lib/cover/presets";
import { DESTINATIONS } from "@/lib/shapes/data";
import type { CoverSticker } from "@/lib/cover/types";

export const metadata = { title: "Cover-Vorschau · Admin" };

const demo = (i: number) => `/cover/demo/${String((i % 10) + 1).padStart(2, "0")}.jpg`;
const D = DESTINATIONS;

export default function CoverPreviewPage() {
  const stickerDemos: { label: string; stickers: CoverSticker[] }[] = [
    { label: "Logo aufs Foto", stickers: [{ asset: "logo", x: 0.74, y: 0.18, scale: 0.34 }] },
    { label: "Pfoten-Spur", stickers: [{ asset: "footprints", x: 0.72, y: 0.5, scale: 0.2, rotation: 12 }] },
    { label: "Spots", stickers: [{ asset: "spots", x: 0.3, y: 0.28, scale: 0.42 }] },
    { label: "Logo-Badge", stickers: [{ asset: "logo-bade", x: 0.72, y: 0.74, scale: 0.36 }] },
  ];

  return (
    <main style={{ padding: "40px clamp(20px,5vw,64px)", background: "#e9e4d6", minHeight: "100vh", fontFamily: "Nunito, system-ui, sans-serif" }}>
      <h1 style={{ fontFamily: "'Baby Mango', system-ui", fontSize: 48, color: "#070e70", marginBottom: 6 }}>Cover-Vorschau</h1>
      <p style={{ color: "#555", marginBottom: 36, maxWidth: 760 }}>
        Auto-generierte Entwürfe aus den Ausflugszielen — <b>gute Mischung aller Template-Typen</b> (Vollbild, Split-Band,
        Blob, Farbrahmen, Editorial, Foto-Untertitel, Marker-Bogen, Frage), <b>bunte Schrift</b>, Stempel = Hauptkategorie.
        Demo-Fotos sind Platzhalter.
      </p>

      <Section title="Feed 4:5 · text-on (Social) — gemischte Templates">
        <Grid min={260}>
          {D.map((d, i) => (
            <Cell key={d.id} label={`${d.name} · ${d.place}`}>
              <Cover spec={coverFromDest(d, { format: "feed", mode: "text-on", photo: demo(i), variantIndex: i })} width={260} />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Brand-Grafik aufs Foto setzen (Ebene 4 · im Editor frei platzierbar)">
        <Grid min={260}>
          {stickerDemos.map((s, i) => (
            <Cell key={i} label={s.label}>
              <Cover width={260} spec={coverFromDest(D[i], { format: "feed", mode: "text-on", template: "vollbild", photo: demo(i), variantIndex: 1, stickers: s.stickers })} />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Plattform-Card 4:5 · text-light (Foto füllt, kein Text)">
        <Grid min={260}>
          {D.slice(0, 6).map((d, i) => (
            <Cell key={d.id} label={d.name}>
              <Cover spec={coverFromDest(d, { format: "feed", mode: "text-light", photo: demo(i), variantIndex: i })} width={260} />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Reel 9:16 · mit Safe-Zone">
        <Grid min={240}>
          {D.slice(0, 4).map((d, i) => (
            <Cell key={d.id} label={d.name}>
              <Cover spec={coverFromDest(d, { format: "reel", mode: "text-on", photo: demo(i), variantIndex: i })} width={240} showGuides />
            </Cell>
          ))}
        </Grid>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#070e70", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>{title}</h2>
      {children}
    </section>
  );
}
function Grid({ children, min }: { children: React.ReactNode; min: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, max-content))`, gap: 22 }}>{children}</div>;
}
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ borderRadius: 14, overflow: "hidden" }}>{children}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#070e70" }}>{label}</div>
    </div>
  );
}
