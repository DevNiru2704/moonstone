import { Fragment } from "react";

// Lens maps for backdrop-filter: url(#lens-*). Red = x shift, green = y shift (128 = none);
// content at the edges is pulled toward the centre, so the glass magnifies what is behind it.
const map = (r: number[], g: number[]) => {
  const stops = (v: number[], c: (n: number) => string) =>
    v.map((n, i) => `<stop offset='${[0, 0.3, 0.5, 0.7, 1][i]}' stop-color='${c(n)}'/>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'>
<defs><linearGradient id='x' x2='1' y2='0'>${stops(r, (n) => `rgb(${n},0,0)`)}</linearGradient>
<linearGradient id='y' x2='0' y2='1'>${stops(g, (n) => `rgb(0,${n},0)`)}</linearGradient></defs>
<rect width='100' height='100' fill='#000'/><rect width='100' height='100' fill='url(#x)'/>
<rect width='100' height='100' fill='url(#y)' style='mix-blend-mode:screen'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const FILTERS = [
  // scale is a fraction of the element's own size, so the lens looks the same at any viewport width
  { id: "lens-pill", scale: 0.12, href: map([255, 170, 128, 86, 0], [200, 156, 128, 100, 56]) },
  { id: "lens-card", scale: 0.06, href: map([255, 170, 128, 86, 0], [255, 170, 128, 86, 0]) },
  { id: "lens-dot", scale: 0.35, href: map([255, 170, 128, 86, 0], [255, 170, 128, 86, 0]) },
];

const CHANNELS = [
  ["r", 0.7, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["g", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["b", 1.35, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
] as const;

export function GlassFilters() {
  return (
    <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden>
      {FILTERS.map((f) => (
        <filter
          key={f.id}
          id={f.id}
          x="0"
          y="0"
          width="1"
          height="1"
          primitiveUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feImage href={f.href} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          {/* each colour channel is bent by a slightly different amount: the rainbow fringe of real glass */}
          {CHANNELS.map(([ch, k, matrix]) => (
            <Fragment key={ch}>
              <feDisplacementMap in="SourceGraphic" in2="map" scale={f.scale * k} xChannelSelector="R" yChannelSelector="G" result={`d${ch}`} />
              <feColorMatrix in={`d${ch}`} type="matrix" values={matrix} result={ch} />
            </Fragment>
          ))}
          <feBlend in="r" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="b" mode="screen" />
        </filter>
      ))}
    </svg>
  );
}
