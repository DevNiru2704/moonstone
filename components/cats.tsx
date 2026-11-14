type Accessory = "none" | "laptop" | "cup" | "glare";

/** One flat cat (viewBox 200 x 160) in the brand palette. `data-pupil` dots are moved by the page to follow the pointer. */
export function Cat({ fur, accessory = "none", className }: { fur: string; accessory?: Accessory; className?: string }) {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="A cat" className={className} fill="none">
      <path className="cat-tail" d="M160 128c30-6 34-40 14-52" stroke={fur} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="100" cy="116" rx="68" ry="38" fill={fur} />
      <polygon points="64,50 68,16 94,38" fill={fur} />
      <polygon points="136,50 132,16 106,38" fill={fur} />
      <polygon points="70,44 72,26 86,38" fill="#fae4d5" />
      <polygon points="130,44 128,26 114,38" fill="#fae4d5" />
      <circle cx="100" cy="72" r="40" fill={fur} />
      {[84, 116].map((x) => (
        <g key={x}>
          <circle cx={x} cy="70" r={accessory === "glare" ? 10 : 8} fill="#fff8f5" />
          <circle data-pupil cx={x} cy="70" r={accessory === "glare" ? 6 : 4} fill="#0a0a0a" />
        </g>
      ))}
      <polygon points="95,84 105,84 100,90" fill="#b31e32" />
      <path d="M100 90v4M92 98c4 3 12 3 16 0" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 86l-22-4M62 92l-22 6M138 86l22-4M138 92l22 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
      {accessory === "laptop" && (
        <g>
          <rect x="52" y="112" width="96" height="46" rx="4" fill="#0a0a0a" />
          <rect x="58" y="118" width="84" height="34" rx="2" fill="#8ea58b" />
          <path d="M66 128h30M66 136h50M66 144h20" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {accessory === "cup" && (
        <g>
          <rect x="150" y="110" width="28" height="34" rx="4" fill="#fff8f5" />
          <path d="M178 118h6a6 6 0 0 1 0 14h-6" stroke="#fff8f5" strokeWidth="5" />
          <rect x="150" y="110" width="28" height="8" rx="3" fill="#b31e32" />
        </g>
      )}
    </svg>
  );
}
