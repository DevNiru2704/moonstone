"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "flag-icons/css/flag-icons.min.css";
import countries from "@/lib/countries.json";
import { u } from "@/lib/lenis";

export type Country = (typeof countries)[number];
export const DEFAULT_COUNTRY = countries.find((c) => c.code === "in")!;

const Flag = ({ code, w, h }: { code: string; w: number; h: number }) => (
  <span aria-hidden className={`fi fi-${code} block shrink-0`} style={{ width: u(w), height: u(h), backgroundSize: "cover" }} />
);

/** Flag + caret button with a searchable list of countries (data in lib/countries.json). Used inside the glass form card. */
export function CountryPicker({ value, onChange }: { value: Country; onChange: (c: Country) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const root = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/^\+/, "");
    return t ? countries.filter((c) => c.name.toLowerCase().includes(t) || c.code === t || c.dial.slice(1).startsWith(t)) : countries;
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) =>
      !root.current?.contains(e.target as Node) && !popup.current?.contains(e.target as Node) && setOpen(false);
    // the popup is fixed to the page, so it would drift away from the field: close it when the page moves
    const shut = () => setOpen(false);
    addEventListener("pointerdown", away);
    addEventListener("scroll", shut, { passive: true });
    addEventListener("resize", shut);
    return () => {
      removeEventListener("pointerdown", away);
      removeEventListener("scroll", shut);
      removeEventListener("resize", shut);
    };
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, shown]);

  const close = () => {
    setOpen(false);
    setQ("");
  };
  const pick = (c: Country) => {
    onChange(c);
    close();
  };

  return (
    <div ref={root} className="absolute" style={{ left: u(35), top: u(161) }}>
      <button
        type="button"
        aria-label={`Country code: ${value.name} ${value.dial}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ left: r.left, top: r.bottom + 6 });
          setOpen((o) => !o);
          setActive(Math.max(0, countries.findIndex((c) => c.code === value.code)));
          setTimeout(() => search.current?.focus({ preventScroll: true }));
        }}
        className="flex cursor-pointer items-center"
        style={{ height: u(28), gap: u(8), paddingTop: u(3), alignItems: "flex-start" }}
      >
        <Flag code={value.code} w={27} h={16} />
        <span
          aria-hidden
          style={{
            marginTop: u(5.5),
            borderLeft: `${u(4)} solid transparent`,
            borderRight: `${u(4)} solid transparent`,
            borderTop: `${u(5)} solid #fff`,
          }}
        />
      </button>

      {open &&
        createPortal(
        <div
          ref={popup}
          // outside the form card (portal), so the blur sees the page behind it: same glass look as the cards and the menu
          className="glass-rim fixed z-[70] text-white"
          style={{
            top: pos.top,
            left: pos.left,
            width: u(284),
            borderRadius: u(20),
            background: "rgba(10,10,10,0.38)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, shown.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (shown[active]) pick(shown[active]);
            }
          }}
        >
          <input
            ref={search}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Search country or code"
            aria-label="Search country"
            role="combobox"
            aria-expanded
            aria-controls="country-list"
            aria-activedescendant={shown[active] ? `country-${shown[active].code}` : undefined}
            className="mx-auto block bg-transparent text-white outline-none placeholder:text-white/60 border-b border-white"
            style={{ width: `calc(100% - ${u(40)})`, margin: `${u(16)} ${u(20)} ${u(6)}`, padding: `0 0 ${u(8)}`, fontSize: u(14) }}
          />
          <ul id="country-list" ref={list} role="listbox" aria-label="Countries" className="country-scroll overflow-y-auto overscroll-contain" style={{ maxHeight: u(190), marginBottom: u(10) }} data-lenis-prevent>
            {shown.map((c, i) => (
              <li
                key={c.code}
                id={`country-${c.code}`}
                role="option"
                aria-selected={c.code === value.code}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(c)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center transition-colors duration-150 ${i === active ? "bg-white/15" : ""} ${c.code === value.code ? "text-crimson" : ""}`}
                style={{ gap: u(10), padding: `${u(6)} ${u(20)}`, fontSize: u(14) }}
              >
                <Flag code={c.code} w={21} h={14} />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className={c.code === value.code ? "" : "text-white/70"}>{c.dial}</span>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="text-white/70" style={{ padding: `${u(10)} ${u(20)}`, fontSize: u(14) }}>
                No match
              </li>
            )}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
