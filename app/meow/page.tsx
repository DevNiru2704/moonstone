import type { Metadata } from "next";
import { MeowPage } from "@/components/meow-page";

// Hidden page: not linked anywhere and kept out of search results.
export const metadata: Metadata = { title: "Meow | Moonstone", robots: { index: false, follow: false } };

export default function Page() {
  return <MeowPage />;
}
