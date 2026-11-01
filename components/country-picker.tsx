"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/^\+/, "");
    return t ? countries.filter((c) => c.name.toLowerCase().includes(t) || c.code === t || c.dial.slice(1).startsWith(t)) : countries;
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("pointerdown", away);
    return () => removeEventListener("pointerdown", away);
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
        onClick={() => {
          setOpen((o) => !o);
          setActive(Math.max(0, countries.findIndex((c) => c.code === value.code)));
          setTimeout(() => search.current?.focus());
        }}
        className="flex cursor-pointer items-center"
        style={{ height: u(28), gap: u(11), paddingTop: u(3), alignItems: "flex-start" }}
      >
        <Flag code={value.code} w={27} h={16} />
        <span
          aria-hidden
          style={{
            marginTop: u(7),
            borderLeft: `${u(4)} solid transparent`,
            borderRight: `${u(4)} solid transparent`,
            borderTop: `${u(5)} solid #fff`,
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 overflow-hidden text-white"
          style={{
            top: u(34),
            left: 0,
            width: u(284),
            borderRadius: u(15),
            background: "rgba(18,18,18,0.94)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
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
            className="block w-full border-b border-white/30 bg-transparent text-white outline-none placeholder:text-white/60"
            style={{ padding: `${u(10)} ${u(14)}`, fontSize: u(14) }}
          />
          <ul id="country-list" ref={list} role="listbox" aria-label="Countries" className="overflow-y-auto overscroll-contain" style={{ maxHeight: u(190) }} data-lenis-prevent>
            {shown.map((c, i) => (
              <li
                key={c.code}
                id={`country-${c.code}`}
                role="option"
                aria-selected={c.code === value.code}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(c)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center ${i === active ? "bg-white/15" : ""}`}
                style={{ gap: u(10), padding: `${u(6)} ${u(14)}`, fontSize: u(14) }}
              >
                <Flag code={c.code} w={21} h={14} />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="text-white/70">{c.dial}</span>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="text-white/70" style={{ padding: `${u(10)} ${u(14)}`, fontSize: u(14) }}>
                No match
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
