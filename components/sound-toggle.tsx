"use client";

import { useEffect, useState } from "react";
import { chip } from "@/lib/chiptune";
import { u } from "@/lib/lenis";

/** Square pixel speaker icon (crisp at any size). */
const Speaker = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 12 10" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden fill="currentColor">
    <rect x="1" y="3" width="2" height="4" />
    <rect x="3" y="2" width="1" height="6" />
    <rect x="4" y="1" width="1" height="8" />
    {on ? (
      <>
        <rect x="6" y="3" width="1" height="4" />
        <rect x="8" y="2" width="1" height="6" />
        <rect x="10" y="1" width="1" height="8" />
      </>
    ) : (
      <>
        <rect x="6" y="3" width="1" height="1" />
        <rect x="7" y="4" width="2" height="2" />
        <rect x="9" y="3" width="1" height="1" />
        <rect x="6" y="6" width="1" height="1" />
        <rect x="9" y="6" width="1" height="1" />
      </>
    )}
  </svg>
);

/** The page's only audio control. Sound starts off (browsers block autoplay, and nobody asked for noise). */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const vis = () => chip.suspend(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      chip.dispose(); // leaving the page ends the music
    };
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Battle music and sound effects"
      title={on ? "Sound on. Click to mute." : "Sound off. Click for battle music."}
      onClick={() => {
        chip.enable(!on);
        setOn(!on);
      }}
      className="flex items-center gap-[0.6em] text-white outline-none focus-visible:ring-4 focus-visible:ring-[#ffd23f]"
      style={{
        fontFamily: "var(--font-px), monospace",
        fontSize: u(15),
        minHeight: 44,
        minWidth: 44,
        padding: `0 ${u(14)}`,
        background: "linear-gradient(#2238b8, #0b1470)",
        border: `${u(4)} solid #f1f4ff`,
        borderRadius: u(10),
        boxShadow: `0 0 0 ${u(2)} #05082b`,
        textShadow: "2px 2px 0 #000",
        cursor: "pointer",
      }}
    >
      <span style={{ width: 24, height: 20, display: "block", color: on ? "#ffd23f" : "#9bc4ff" }}>
        <Speaker on={on} />
      </span>
      <span>{on ? "SOUND ON" : "SOUND OFF"}</span>
    </button>
  );
}
