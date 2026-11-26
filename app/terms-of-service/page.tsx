import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = pageMetadata("/terms-of-service");

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
