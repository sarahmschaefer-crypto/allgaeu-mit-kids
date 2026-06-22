// components/cover/FigmaCover.tsx — rendert ein FigmaTemplate 1:1 (px @ 1080×1350),
// skaliert auf `width`. Inhalts-Slots: photo, slogan, overline, number, stampCategory.
import "./cover.css";
import { COVER_COLORS, type CoverColor } from "@/lib/cover/types";
import type { FigmaTemplate, FTLayer, FTText } from "@/lib/cover/figma-templates";

const col = (c: CoverColor | "white") => (c === "white" ? "#ffffff" : COVER_COLORS[c]);

export type FigmaContent = {
  photo?: string;
  slogan: string;
  overline?: string;
  place?: string;
  number?: string;
  subtitle?: string;
  stampCategory: string;
  showStamp?: boolean;
};

const fontFamily = (f: FTText["font"]) => (f === "mango" ? "'Baby Mango', system-ui" : "'Nunito', system-ui, sans-serif");

// Schriftgröße so verkleinern, dass der Text in BREITE und HÖHE in den Rahmen passt
// → kein seitlicher und kein vertikaler Überlauf. SSR-sicher (keine DOM-Messung),
// Heuristik: Baby-Mango-Großbuchstaben ~0.54em breit.
const FACTOR = 0.54;

// Fließtext (umbricht an Leerzeichen): längstes Wort muss in die Breite, geschätzte
// Zeilenzahl × Zeilenhöhe in die Höhe.
function fitText(text: string, base: number, availW: number, availH: number, lh: number): number {
  const words = text.split(/\s+/).filter(Boolean);
  const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
  const totalC = words.reduce((s, w) => s + w.length, 0) + Math.max(0, words.length - 1);
  const fits = (S: number) => {
    if (longest * S * FACTOR > availW) return false;
    const lines = Math.max(1, Math.ceil((totalC * S * FACTOR) / availW));
    return lines * S * lh <= availH;
  };
  let S = Math.round(base);
  while (S > base * 0.4 && !fits(S)) S--;
  return Math.max(Math.round(base * 0.4), S);
}

// Marker (jede Zeile auf eigenem Balken, gestapelt): längste Zeile in die Breite,
// Summe der Balkenhöhen in die Höhe.
function fitMarker(lines: string[], base: number, availW: number, availH: number, padV: number, gap: number): number {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  const fits = (S: number) => {
    if (longest * S * FACTOR > availW) return false;
    const total = lines.length * (S * 0.92 + padV) + Math.max(0, lines.length - 1) * gap;
    return total <= availH;
  };
  let S = Math.round(base);
  while (S > base * 0.4 && !fits(S)) S--;
  return Math.max(Math.round(base * 0.4), S);
}

function textValue(t: FTText, c: FigmaContent): string {
  let v = t.value ?? "";
  if (t.field === "slogan") v = c.slogan;
  else if (t.field === "overline") v = c.overline ?? c.place ?? "";
  else if (t.field === "number") v = c.number ?? "";
  else if (t.field === "subtitle") v = c.subtitle ?? "";
  return t.upper ? v.toUpperCase() : v;
}

function Layer({ layer, content }: { layer: FTLayer; content: FigmaContent }) {
  if (layer.type === "photo") {
    const r = layer.radius;
    const borderRadius = r ? `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px` : undefined;
    const mask = layer.mask
      ? { WebkitMaskImage: `url(/cover/graphics/${layer.mask}.svg)`, maskImage: `url(/cover/graphics/${layer.mask}.svg)`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as const
      : {};
    return (
      <div style={{ position: "absolute", left: layer.x, top: layer.y, width: layer.w, height: layer.h, borderRadius, overflow: "hidden", transform: layer.rot ? `rotate(${layer.rot}deg)` : undefined, ...mask }}>
        {content.photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={content.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : null}
        {layer.scrim && (
          <div style={{ position: "absolute", left: 0, top: layer.scrim.y - layer.y, width: "100%", height: layer.scrim.h,
            background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,${layer.scrim.to}))` }} />
        )}
      </div>
    );
  }
  if (layer.type === "band") {
    return <div style={{ position: "absolute", left: layer.x, top: layer.y, width: layer.w, height: layer.h, background: col(layer.color) }} />;
  }
  if (layer.type === "stamp") {
    if (content.showStamp === false) return null;
    return (
      <div style={{ position: "absolute", left: layer.x, top: layer.y, width: layer.size, height: layer.size, borderRadius: "50%", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/cover/stamps/${content.stampCategory}.png`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "50%" }} />
      </div>
    );
  }
  if (layer.type === "graphic") {
    const src = layer.asset === "logo" ? "/logo-allgaeu.svg" : `/cover/graphics/${layer.asset}.svg`;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" style={{ position: "absolute", left: layer.x, top: layer.y, width: layer.w, height: layer.h, objectFit: layer.h ? "contain" : undefined, objectPosition: "left top", transform: layer.rot ? `rotate(${layer.rot}deg)` : undefined }} />;
  }
  if (layer.type === "marker") {
    const lines = content.slogan.split("\n");
    const availW = (layer.w ?? 1080 - 2 * layer.x) - layer.pad[1] - layer.pad[3];
    const availH = 1350 - layer.y - 72;
    const mSize = fitMarker(lines, layer.size, availW, availH, layer.pad[0] + layer.pad[2], layer.gap);
    return (
      <div style={{ position: "absolute", left: layer.x, top: layer.y, width: layer.w, display: "flex", flexDirection: "column", gap: layer.gap, alignItems: layer.align === "center" ? "center" : "flex-start" }}>
        {lines.map((ln, i) => (
          <div key={i} style={{
            background: col(layer.barColor), color: col(layer.textColor),
            padding: `${layer.pad[0]}px ${layer.pad[1]}px ${layer.pad[2]}px ${layer.pad[3]}px`,
            borderRadius: layer.radius, fontFamily: "'Baby Mango', system-ui", fontSize: mSize,
            lineHeight: 0.92, letterSpacing: layer.tracking, whiteSpace: "nowrap",
          }}>{ln}</div>
        ))}
      </div>
    );
  }
  // text
  const t = layer;
  const txt = textValue(t, content);
  const availW = t.w ?? 1080 - 2 * t.x;
  const availH = 1350 - t.y - 80;
  const tSize = fitText(txt, t.size, availW, availH, t.lh);
  return (
    <div style={{
      position: "absolute", left: t.x, top: t.y, width: t.w,
      fontFamily: fontFamily(t.font), fontWeight: t.weight ?? 400, fontSize: tSize,
      lineHeight: t.lh, letterSpacing: t.tracking, color: col(t.color),
      textAlign: t.align ?? "left", whiteSpace: "pre-wrap", overflowWrap: "break-word", margin: 0,
    }}>
      {txt}
    </div>
  );
}

export function FigmaCover({
  template, content, width = 1080, className = "",
}: { template: FigmaTemplate; content: FigmaContent; width?: number; className?: string }) {
  const scale = width / 1080;
  return (
    <div className={`amk-cover-wrap ${className}`} style={{ width, height: 1350 * scale }}>
      <div className="amk-cover feed" style={{ width: 1080, height: 1350, transform: `scale(${scale})`, background: template.bg ? col(template.bg) : undefined }}>
        {template.layers.map((l, i) => <Layer key={i} layer={l} content={content} />)}
      </div>
    </div>
  );
}
