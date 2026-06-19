// app/admin/cover-preview/page.tsx — Live-Vorschau des Cover-Renderers.
// Zeigt alle Ziele als Feed-Cover (text-on), Plattform-Cards (text-light)
// und Beispiel-Reels mit Safe-Zone. Demo-Fotos aus /public/cover/demo.
import { Cover } from "@/components/cover/Cover";
import { coverFromDest } from "@/lib/cover/presets";
import { DESTINATIONS } from "@/lib/shapes/data";

export const metadata = { title: "Cover-Vorschau · Admin" };

const demo = (i: number) => `/cover/demo/${String((i % 10) + 1).padStart(2, "0")}.jpg`;

export default function CoverPreviewPage() {
  return (
    <main style={{ padding: "40px clamp(20px,5vw,64px)", background: "#e9e4d6", minHeight: "100vh", fontFamily: "Nunito, system-ui, sans-serif" }}>
      <h1 style={{ fontFamily: "'Baby Mango', system-ui", fontSize: 48, color: "#070e70", marginBottom: 6 }}>Cover-Vorschau</h1>
      <p style={{ color: "#555", marginBottom: 36, maxWidth: 720 }}>
        Auto-generierte Entwürfe aus den Ausflugszielen (Slogan = <code>teaser</code>, Stempel = Hauptkategorie,
        Template-Mix ~3:1). Demo-Fotos sind Platzhalter. Editor + echter Foto-Import folgen.
      </p>

      <Section title="Feed 4:5 · text-on (Social)">
        <Grid min={260}>
          {DESTINATIONS.map((d, i) => (
            <Cell key={d.id} label={`${d.name} · ${d.place}`}>
              <Cover spec={coverFromDest(d, { format: "feed", mode: "text-on", photo: demo(i) })} width={260} />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Plattform-Card 4:5 · text-light (kein eingebrannter Text)">
        <Grid min={260}>
          {DESTINATIONS.slice(0, 6).map((d, i) => (
            <Cell key={d.id} label={d.name}>
              <Cover spec={coverFromDest(d, { format: "feed", mode: "text-light", photo: demo(i) })} width={260} />
            </Cell>
          ))}
        </Grid>
      </Section>

      <Section title="Reel 9:16 · mit Safe-Zone">
        <Grid min={240}>
          {DESTINATIONS.slice(0, 3).map((d, i) => (
            <Cell key={d.id} label={d.name}>
              <Cover spec={coverFromDest(d, { format: "reel", mode: "text-on", photo: demo(i) })} width={240} showGuides />
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
      <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 18px rgba(7,14,112,.15)" }}>{children}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#070e70" }}>{label}</div>
    </div>
  );
}
