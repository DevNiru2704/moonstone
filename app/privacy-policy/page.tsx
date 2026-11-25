import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy | Moonstone" };

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
