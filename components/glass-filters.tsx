import { Fragment } from "react";

// Lens filters for backdrop-filter: url(#lens-*). The map bitmap (R = x shift, G = y shift, 128 = none) splits the
// glass in three: the middle shows the backdrop as it is, the top and bottom bands show it smaller and mirrored
// (the sample point runs back past the band edge), the end caps pull a little inward. The colour channels are bent
// by slightly different amounts for the rainbow fringe of real glass: `passes` 3 = one displacement per channel
// (small elements), 2 = red vs green+blue (big elements, 3 fewer full-size passes).
const FILTERS = [
  // scale is a fraction of the element's width (Skia uses it for both axes), so the lens looks the same at any viewport width
  { id: "lens-pill", map: "lens-map-pill", scale: 0.283, passes: 3 }, // 1.08 * height / width
  { id: "lens-dot", map: "lens-map-pill", scale: 1.08, passes: 3 },
  // card bands: the photo hides most of the backdrop, so the lens only runs where sky shows. Top and bottom rims
  // use the same three-part idea as the pill (rim = smaller, mirrored sky from further in; rest untouched), the
  // side rims pull inward like the pill's end caps
  { id: "edge-l", map: "lens-edge-l", scale: 1, passes: 2, spread: 0.2 },
  { id: "edge-r", map: "lens-edge-r", scale: 1, passes: 2, spread: 0.2 },
  { id: "edge-t", map: "lens-edge-t", scale: 0.32, passes: 2, spread: 0.1 }, // ~0.88 * 2 * 3b * h / w: keeps the fringe pass inside the band
  { id: "edge-b", map: "lens-edge-b", scale: 0.36, passes: 2, spread: 0.1 },
] as const;

// [result, scale factor, colour matrix keeping that channel (and alpha)]
const CHANNELS = {
  3: [
    ["r", 0.7, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["g", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["b", 1.35, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
  ],
  // red and green+blue are bent by 1 -/+ spread of the full amount
  2: [
    ["r", -1, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["gb", 1, "0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"],
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
              <feDisplacementMap in="SourceGraphic" in2="map" scale={f.scale * (f.passes === 2 ? 1 + k * f.spread : k)} xChannelSelector="R" yChannelSelector="G" />
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
