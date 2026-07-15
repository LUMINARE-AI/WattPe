import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { Lock, FileCheck, RefreshCcw, Gauge } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & Transparency",
  description:
    "How WattPe protects your reservation — metered generation, escrowed refunds, and audited plant performance.",
};

const PILLARS = [
  {
    icon: Gauge,
    title: "Independently metered generation",
    description:
      "Every plant reports generation from certified meters, not estimates. What you're credited traces back to actual kWh produced.",
  },
  {
    icon: Lock,
    title: "Refunds held in escrow",
    description:
      "Plans with a refund component keep the refund reserve set aside from day one, growing at a fixed rate until it's due back to you.",
  },
  {
    icon: FileCheck,
    title: "Audited plant history",
    description:
      "New plants publish commissioning and capacity data up front; acquired plants come with an audited generation track record.",
  },
  {
    icon: RefreshCcw,
    title: "Clear exit terms",
    description:
      "Every plan states its tenure and any early-exit terms clearly before you reserve — no surprise lock-ins.",
  },
];

export default function SafetyTransparencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety & transparency"
        title="How we protect every reservation"
        description="Solar capacity is a long-term commitment. Here's exactly how WattPe keeps that commitment safe and verifiable."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="border-border bg-card hover:border-primary/40 flex gap-4 rounded-2xl border p-6 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)] transition-colors"
              >
                <div className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <pillar.icon className="text-primary size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{pillar.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted/40 py-20 sm:py-28">
        <Container className="max-w-3xl">
          <div className="border-border bg-card rounded-3xl border p-8 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)] sm:p-10">
            <h2 className="font-heading text-2xl font-bold">
              A note on risk
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              WattPe plans are long-tenure commitments tied to a physical
              solar asset, not a guaranteed financial product. Savings depend
              on actual plant generation, plan terms, and continued DISCOM
              support for third-party credit arrangements. Read the full{" "}
              <a
                href="/legal/disclaimer"
                className="text-primary underline underline-offset-2"
              >
                disclaimer
              </a>{" "}
              before reserving capacity.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
