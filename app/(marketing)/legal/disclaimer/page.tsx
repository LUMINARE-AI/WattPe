import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { DISCLAIMER } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important information about performance estimates and risk before reserving WattPe solar capacity.",
};

export default function DisclaimerPage() {
  return <LegalPage doc={DISCLAIMER} />;
}
