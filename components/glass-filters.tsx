import { Fragment } from "react";

// Lens filters for backdrop-filter: url(#lens-*). The map bitmap (R = x shift, G = y shift, 128 = none) pulls the
// edges toward the centre, so the glass magnifies what is behind it. The colour channels are bent by slightly
// different amounts for the rainbow fringe of real glass: `passes` 3 = one displacement per channel (small
// elements), 2 = red vs green+blue (big elements, 3 fewer full-size passes).
const FILTERS = [
  // scale is a fraction of the element's own size, so the lens looks the same at any viewport width
  { id: "lens-pill", map: "lens-map-pill", scale: 0.12, passes: 3 },
  { id: "lens-card", map: "lens-map", scale: 0.06, passes: 2 },
  { id: "lens-dot", map: "lens-map", scale: 0.35, passes: 3 },
] as const;

// [result, scale factor, colour matrix keeping that channel (and alpha)]
const CHANNELS = {
  3: [
    ["r", 0.7, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["g", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["b", 1.35, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
  ],
  2: [
    ["r", 0.7, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["gb", 1.2, "0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"],
  ],
} as const;

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
          <feImage href={`/img/${f.map}.png`} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          {CHANNELS[f.passes].map(([ch, k, matrix]) => (
            <Fragment key={ch}>
              <feDisplacementMap in="SourceGraphic" in2="map" scale={f.scale * k} xChannelSelector="R" yChannelSelector="G" />
              <feColorMatrix type="matrix" values={matrix} result={ch} />
            </Fragment>
          ))}
          {f.passes === 3 ? (
            <>
              <feBlend in="r" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="b" mode="screen" />
            </>
          ) : (
            <feBlend in="r" in2="gb" mode="screen" />
          )}
        </filter>
      ))}
    </svg>
  );
}
