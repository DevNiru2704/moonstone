import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = pageMetadata("/privacy-policy");

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
