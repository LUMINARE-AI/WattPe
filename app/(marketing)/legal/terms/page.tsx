import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { TERMS } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "WattPe's Terms of Service.",
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
