import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { page, pageGraph, pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = pageMetadata("/privacy-policy");

export default function Page() {
  return (
    <>
      <JsonLd data={pageGraph(page("/privacy-policy"))} />
      <LegalPage doc={PRIVACY} />
    </>
  );
}
