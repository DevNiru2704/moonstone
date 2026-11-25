"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

const go = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView();
};

/** Renders nothing. Smooth scrolling (Lenis) swallows the browser's own jump to #id when the page is reached or the link is used on the client, so do it here. */
export function HashScroll() {
  useEffect(() => {
    // arriving on the page (links from other pages): wait for the layout to settle
    const t = setTimeout(() => location.hash && go(location.hash.slice(1)), 400);
    // a link to a section of this very page
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
      if (!a || a.pathname !== location.pathname || !a.hash) return;
      setTimeout(() => go(a.hash.slice(1)), 0);
    };
    document.addEventListener("click", click);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
