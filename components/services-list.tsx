import { SERVICES } from "@/lib/moonstoned";
import { u } from "@/lib/lenis";

const trim = { textBox: "trim-both cap alphabetic" } as React.CSSProperties;

// Figma "Wireframe - 5": the heading and eight rows; hovering a row grows it 148 -> 194 and shows its description (smart animate linear 0.3s).
export function ServicesList() {
  return (
    <section id="services" className="relative bg-white text-black" style={{ height: u(1819) }}>
      <h2 className="absolute whitespace-nowrap" style={{ left: u(88.19), top: u(220.2), fontSize: u(60), lineHeight: 1.18, ...trim }}>
        OUR
        <br />
        <em className="text-crimson">SERVICES</em>
      </h2>
      <div className="absolute flex flex-col" style={{ left: u(88.19), top: u(530), width: u(1263.625) }}>
        {SERVICES.map(([title, text], i) => (
          <div
            key={title}
            tabIndex={0}
            className="group relative h-[calc(var(--u)*148)] overflow-hidden transition-[height] duration-300 ease-linear hover:h-[calc(var(--u)*194)] focus:h-[calc(var(--u)*194)] focus:outline-none"
          >
            <div className="absolute inset-x-0 border-t border-black" style={{ top: 0 }} />
            <div className="absolute inset-x-0 bottom-0 border-b border-black" />
            <p className="absolute whitespace-nowrap" style={{ left: 0, top: u(59.5), fontSize: u(16), ...trim }}>
              {i + 1}/
            </p>
            <h3 className="absolute whitespace-nowrap font-normal" style={{ left: u(82.84), top: u(59.5), fontSize: u(40), ...trim }}>
              {title}
            </h3>
            <p
              className="absolute whitespace-nowrap opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100 group-focus:opacity-100"
              style={{ left: u(82.88), top: u(128.5), fontSize: u(24), fontWeight: 300, letterSpacing: u(-0.72), ...trim }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
