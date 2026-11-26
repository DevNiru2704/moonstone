import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { page, pageGraph, pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = pageMetadata("/terms-of-service");

export default function Page() {
  return (
    <>
      <JsonLd data={pageGraph(page("/terms-of-service"))} />
      <LegalPage doc={TERMS} />
    </>
  );
}
