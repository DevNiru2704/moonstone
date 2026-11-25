import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of Service | Moonstone" };

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
