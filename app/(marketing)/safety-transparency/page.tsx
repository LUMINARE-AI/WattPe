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

      <section className="pt-20 pb-10 sm:pt-28 sm:pb-14">
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

      <section className="bg-muted/40 pt-10 pb-10 sm:pt-14 sm:pb-14">
        <Container>
          <div className="border-border from-brand-green/5 via-card to-brand-cyan/5 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_8px_24px_rgba(15,31,31,0.06)] sm:p-10">
            <div
              aria-hidden
              className="bg-brand-sun/15 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl"
            />
            <div className="relative grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-12">
              <div className="flex items-start gap-4 lg:block">
                <div className="border-brand-sun/30 bg-brand-sun/10 flex size-12 shrink-0 items-center justify-center rounded-2xl border lg:mb-5">
                  <FileCheck className="text-brand-sun size-5" />
                </div>
                <div>
                  <p className="text-brand-sun text-sm font-semibold tracking-wide uppercase">
                    Before you reserve
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold sm:text-3xl">
                    A note on risk
                  </h2>
                </div>
              </div>
              <div className="lg:border-border lg:border-l lg:pl-12">
                <p className="text-muted-foreground text-base leading-relaxed">
                  WattPe plans are long-tenure commitments tied to a physical
                  solar asset, not a guaranteed financial product. Savings depend
                  on actual plant generation, plan terms, and continued DISCOM
                  support for third-party credit arrangements.
                </p>
                <a
                  href="/legal/disclaimer"
                  className="text-primary mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  Read the full disclaimer
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
