// components/cover/Cover.tsx — EIN Renderer für alle Cover.
// Rendert eine CoverSpec maßstabsgetreu (1080-Basis), skaliert auf `width`.
// mode "text-on" = Social (mit Schrift), "text-light" = Plattform-Card (ohne Text).
import "./cover.css";
import { COVER_COLORS, type CoverColor, type CoverSpec } from "@/lib/cover/types";

const col = (c?: CoverColor) => (c ? COVER_COLORS[c] : undefined);

function Headline({ spec }: { spec: CoverSpec }) {
  const color = col(spec.textColor) ?? "#fff";
  const shadow = spec.scrim && !spec.bar ? "0 4px 30px rgba(7,14,112,.5)" : undefined;
  const inner = spec.bar
    ? <span className="bar" style={{ background: col(spec.bar), color: col(spec.barText) ?? COVER_COLORS.ink }}>{spec.slogan}</span>
    : spec.slogan;
  return (
    <div className="amk-headline" style={{ fontSize: spec.fontSize ?? 112, color, textShadow: shadow }}>
      {inner}
    </div>
  );
}

function Stamp({ spec }: { spec: CoverSpec }) {
  if (spec.showStamp === false) return null;
  return (
    <div className="amk-stamp">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/cover/stamps/${spec.category}.png`} alt="" />
    </div>
  );
}

function focalPos(spec: CoverSpec) {
  if (!spec.focal) return undefined;
  return `${spec.focal.x * 100}% ${spec.focal.y * 100}%`;
}

export function Cover({
  spec,
  width = 1080,
  showGuides = false,
  className = "",
}: {
  spec: CoverSpec;
  width?: number;
  showGuides?: boolean;
  className?: string;
}) {
  const baseH = spec.format === "reel" ? 1920 : 1350;
  const scale = width / 1080;
  const textOn = spec.mode !== "text-light";
  const eyebrowColor = col(spec.textColor) ?? "#fff";
  // eslint-disable-next-line @next/next/no-img-element
  const Img = (p: { src: string }) => <img className="amk-photo" src={p.src} alt="" style={{ objectPosition: focalPos(spec) }} />;

  let inner: React.ReactNode = null;

  if (!textOn) {
    // Plattform-Card: immer FÜLLENDES Foto (full-bleed) + Stempel, kein Rahmen.
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        <Stamp spec={spec} />
      </>
    );
  } else if (spec.template === "vollbild") {
    inner = (
      <>
        {spec.photo ? <Img src={spec.photo} /> : null}
        {spec.scrim ? <div className={spec.format === "reel" ? "amk-scrim-tb" : "amk-scrim-b"} /> : null}
        <Stamp spec={spec} />
        {textOn && (
          <div className="amk-block">
            <div className="amk-eyebrow" style={{ color: eyebrowColor }}>{spec.category} · {spec.place}</div>
            <Headline spec={spec} />
          </div>
        )}
      </>
    );
  } else if (spec.template === "blob") {
    inner = (
      <>
        <Stamp spec={spec} />
        {spec.photo ? <div className="amk-blobwrap"><img src={spec.photo} alt="" style={{ objectPosition: focalPos(spec) }} /></div> : null}
        {textOn && (
          <div className="amk-block">
            <Headline spec={spec} />
            <div className="amk-eyebrow" style={{ color: col(spec.textColor), marginTop: 26, opacity: 0.92 }}>{spec.place}</div>
          </div>
        )}
      </>
    );
  } else {
    inner = (
      <>
        <Stamp spec={spec} />
        {textOn && (
          <div className="amk-block">
            <div className="amk-eyebrow">{spec.category} · {spec.place}</div>
            <Headline spec={spec} />
          </div>
        )}
        {spec.photo ? <div className="amk-photoframe"><img src={spec.photo} alt="" style={{ objectPosition: focalPos(spec) }} /></div> : null}
      </>
    );
  }

  const bg = spec.template === "editorial" ? COVER_COLORS.paper : col(spec.bg);

  return (
    <div className={`amk-cover-wrap ${className}`} style={{ width, height: baseH * scale }}>
      <div
        className={`amk-cover ${spec.format} t-${spec.template}`}
        style={{ transform: `scale(${scale})`, background: bg }}
      >
        {inner}
        {showGuides && spec.format === "reel" && (
          <div className="amk-safezone"><div className="tag">↓ Safe-Zone = Feed-Ausschnitt 4:5 ↓</div></div>
        )}
      </div>
    </div>
  );
}
