"use client";

import { useState } from "react";
import { FAQ } from "@/lib/faq";
import { u } from "@/lib/lenis";

const trim = { textBox: "trim-both cap alphabetic" } as React.CSSProperties;

/**
 * The FAQ as the Our Services rows on Moonstone*d (number, big question, black lines, height eased in 0.3s linear): a row opens while
 * the pointer is on it (or it has keyboard focus, which is also what a tap does on touch) and closes when the pointer leaves.
 */
export function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="relative text-black" style={{ paddingLeft: u(88.19), paddingTop: u(100), paddingBottom: u(160) }}>
      <h2 className="whitespace-nowrap" style={{ fontSize: u(60), lineHeight: 1.18, ...trim }}>
        FREQUENTLY ASKED
        <br />
        <em className="text-crimson">QUESTIONS</em>
      </h2>
      <div className="border-b border-black" style={{ marginTop: u(160), width: u(1263.625) }}>
        {FAQ.map(({ q, a }, i) => {
          const on = open === i;
          return (
            <div
              key={q}
              className="border-t border-black"
              onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(i)}
              onPointerLeave={(e) => e.pointerType !== "touch" && setOpen((o) => (o === i ? null : o))}
            >
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`faq-${i}`}
                onFocus={() => setOpen(i)}
                onBlur={() => setOpen((o) => (o === i ? null : o))}
                className="flex w-full cursor-pointer items-center text-left focus-visible:outline-2 focus-visible:outline-crimson"
                style={{ minHeight: u(148) }}
              >
                <span className="shrink-0" style={{ width: u(82.84), fontSize: u(16) }}>
                  {i + 1}/
                </span>
                <span style={{ fontSize: u(32), lineHeight: 1.25, width: u(1100) }}>{q}</span>
              </button>
              <div
                id={`faq-${i}`}
                role="region"
                className="grid transition-[grid-template-rows] duration-300 ease-linear motion-reduce:transition-none"
                style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div style={{ paddingLeft: u(82.84), paddingBottom: u(56), width: u(1182.84), fontSize: u(24), fontWeight: 300, lineHeight: 1.45 }}>
                    {a.map((p) => (
                      <p key={p} className="[&:not(:first-child)]:mt-[0.7em]">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
