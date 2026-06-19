// components/cover/Cover.tsx — EIN Renderer für alle Cover-Templates.
// Rendert eine CoverSpec maßstabsgetreu (1080-Basis), skaliert auf `width`.
// mode "text-on" = Social (mit Schrift), "text-light" = Plattform-Card (nur Foto).
import "./cover.css";
import { COVER_COLORS, type CoverColor, type CoverGraphic, type CoverSpec, type CoverSticker } from "@/lib/cover/types";

const col = (c?: CoverColor) => (c ? COVER_COLORS[c] : undefined);
const onColor = (c?: CoverColor): string =>
  c === "purple" || c === "orange" || c === "ink" ? COVER_COLORS.white : COVER_COLORS.ink;
const graphicSrc = (a: CoverGraphic) => (a === "logo" ? "/logo-allgaeu.svg" : `/cover/graphics/${a}.png`);

function focalPos(spec: CoverSpec) {
  return spec.focal ? `${spec.focal.x * 100}% ${spec.focal.y * 100}%` : undefined;
}

function Headline({ spec, color }: { spec: CoverSpec; color?: string }) {
  const c = color ?? col(spec.textColor) ?? "#fff";
  const inner = spec.bar
    ? <span className="bar" style={{ background: col(spec.bar), color: col(spec.barText) ?? onColor(spec.bar) }}>{spec.slogan}</span>
    : spec.slogan;
  return (
    <div className={`amk-headline${spec.bar ? " has-bar" : ""}`} style={{ fontSize: spec.fontSize ?? 112, color: c }}>
      {inner}
    </div>
  );
}

function Stamp({ spec }: { spec: CoverSpec }) {
  if (spec.showStamp === false) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <div className="amk-stamp"><img src={`/cover/stamps/${spec.category}.png`} alt="" /></div>;
}
function Logo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <div className="amk-logo"><img src="/logo-allgaeu.svg" alt="Allgäu mit Kids" /></div>;
}
// Ebene 4: frei platzierte Brand-Grafiken / Logo aufs Cover.
function Stickers({ stickers }: { stickers?: CoverSticker[] }) {
  if (!stickers?.length) return null;
  return (
    <>
      {stickers.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} className="amk-sticker" src={graphicSrc(s.asset)} alt=""
          style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, width: `${s.scale * 100}%`, transform: `translate(-50%,-50%) rotate(${s.rotation ?? 0}deg)` }} />
      ))}
    </>
  );
}

export function Cover({
  spec, width = 1080, showGuides = false, className = "",
}: { spec: CoverSpec; width?: number; showGuides?: boolean; className?: string }) {
  const baseH = spec.format === "reel" ? 1920 : 1350;
  const scale = width / 1080;
  const textOn = spec.mode !== "text-light";
  // eslint-disable-next-line @next/next/no-img-element
  const Img = (p: { src: string }) => <img className="amk-photo" src={p.src} alt="" style={{ objectPosition: focalPos(spec) }} />;
  const eyebrow = (color: string) => <div className="amk-eyebrow" style={{ color }}>{spec.category} · {spec.place}</div>;

  let inner: React.ReactNode = null;
  let bg: string | undefined = col(spec.bg);
  const t = spec.template;

  if (!textOn) {
    inner = <>{spec.photo ? <Img src={spec.photo} /> : null}<Stamp spec={spec} /></>;
  } else if (t === "vollbild") {
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        {spec.scrim ? <div className={spec.format === "reel" ? "amk-scrim-tb" : "amk-scrim-b"} /> : null}
        <Stamp spec={spec} />
        <div className={`amk-block${spec.bar ? " has-bar" : ""}`}>{eyebrow(col(spec.textColor) ?? "#fff")}<Headline spec={spec} /></div>
      </>
    );
  } else if (t === "blob") {
    inner = (
      <>
        <Stamp spec={spec} />
        {spec.photo ? <div className="amk-blobwrap"><img src={spec.photo} alt="" style={{ objectPosition: focalPos(spec) }} /></div> : null}
        <div className="amk-block"><Headline spec={spec} /><div className="amk-eyebrow" style={{ color: col(spec.textColor), marginTop: 26, opacity: 0.92 }}>{spec.place}</div></div>
      </>
    );
  } else if (t === "editorial") {
    bg = COVER_COLORS.paper;
    inner = (
      <>
        <Stamp spec={spec} />
        <div className="amk-block">{eyebrow(COVER_COLORS.ink)}<Headline spec={spec} /></div>
        {spec.photo ? <div className="amk-photoframe"><img src={spec.photo} alt="" style={{ objectPosition: focalPos(spec) }} /></div> : null}
      </>
    );
  } else if (t === "split-band") {
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        <div className="amk-band" style={{ background: col(spec.band) ?? COVER_COLORS.purple }} />
        <Stamp spec={spec} />
        <div className="amk-block">{eyebrow(col(spec.textColor) ?? "#fff")}<Headline spec={spec} /></div>
      </>
    );
  } else if (t === "farbrahmen") {
    bg = col(spec.band) ?? COVER_COLORS.purple;
    inner = (
      <>
        <Stamp spec={spec} />
        <div className="amk-block">{eyebrow(col(spec.textColor) ?? "#fff")}<Headline spec={spec} color={col(spec.textColor) ?? "#fff"} /></div>
        {spec.photo ? <div className="amk-photoframe"><img src={spec.photo} alt="" style={{ objectPosition: focalPos(spec) }} /></div> : null}
      </>
    );
  } else if (t === "foto-untertitel") {
    const bars = spec.subtitleBars ?? ["yellow", "purple"];
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        <Stamp spec={spec} />
        <div className="amk-subbars">
          <div className="amk-subbar" style={{ background: col(bars[0]), color: onColor(bars[0]), fontSize: 40 }}>{spec.category} · {spec.place}</div>
          <div className="amk-subbar" style={{ background: col(bars[1] ?? bars[0]), color: onColor(bars[1] ?? bars[0]), fontSize: spec.fontSize ?? 104 }}>{spec.slogan}</div>
        </div>
      </>
    );
  } else if (t === "frage") {
    bg = col(spec.bg) ?? COVER_COLORS.pink;
    inner = (
      <>
        <Stamp spec={spec} />
        <div className="amk-block"><Headline spec={spec} /></div>
        {spec.showLogo !== false ? <Logo /> : null}
      </>
    );
  } else if (t === "marker-bogen") {
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        <div className="amk-shape" style={{ background: col(spec.bg) ?? COVER_COLORS.purple }} />
        {spec.showLogo !== false ? <Logo /> : null}
        <Stamp spec={spec} />
        <div className="amk-block"><Headline spec={spec} color={col(spec.textColor) ?? COVER_COLORS.paper} /></div>
      </>
    );
  }

  return (
    <div className={`amk-cover-wrap ${className}`} style={{ width, height: baseH * scale }}>
      <div className={`amk-cover ${spec.format} t-${spec.template}`} style={{ transform: `scale(${scale})`, background: bg }}>
        {inner}
        <Stickers stickers={spec.stickers} />
        {showGuides && spec.format === "reel" && (
          <div className="amk-safezone"><div className="tag">↓ Safe-Zone = Feed-Ausschnitt 4:5 ↓</div></div>
        )}
      </div>
    </div>
  );
}
