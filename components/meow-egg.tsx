"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Typing "meow" anywhere (outside form fields) opens the hidden page. */
export function MeowEgg() {
  const router = useRouter();
  useEffect(() => {
    let typed = "";
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed === "meow") {
        typed = "";
        router.push("/meow");
      }
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [router]);
  return null;
}
