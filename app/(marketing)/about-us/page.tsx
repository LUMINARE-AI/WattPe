import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { FoundersSection } from "@/components/marketing/founders-section";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "WattPe is building community solar for India — reserve capacity in a shared plant and save on your electricity bill, no rooftop required.",
};

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        eyebrow="About WattPe"
        title="Solar for everyone, not just rooftop owners"
        description="We believe clean energy savings shouldn't depend on owning a roof. WattPe lets anyone reserve capacity in a shared solar plant and save from day one."
        split="md"
      />

      <Reveal>
        <section className="pt-10 pb-8 sm:pt-12 sm:pb-10">
          <Container>
            <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
              <SectionHeading
                eyebrow="Our mission"
                title="Making solar accessible, one reservation at a time"
              />
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed lg:pt-1">
                <p>
                  Most Indian households and small businesses can&apos;t install
                  rooftop solar — they rent, live in apartments, or simply
                  don&apos;t have a suitable roof. WattPe removes that barrier by
                  letting anyone reserve capacity in a community-scale solar
                  plant and receive bill credits for the energy it generates.
                </p>
                <p>
                  We handle the plant, the metering, and the compliance. You get
                  the savings, without the maintenance contracts or upfront
                  installation cost of a rooftop system.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-muted/40 pt-10 pb-4 sm:pt-14 sm:pb-5">
          <Container>
            <SectionHeading eyebrow="Team" title="Who's behind WattPe" align="center" />
            <FoundersSection />
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-2 sm:py-3">
          <Container>
            <div className="border-border bg-card grid gap-3 rounded-2xl border px-5 py-4 sm:grid-cols-3 sm:items-center sm:gap-6 sm:px-6">
              <div>
                <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Registered office
                </p>
                <h2 className="font-heading mt-1 text-lg font-bold">Where to find us</h2>
              </div>
              <p className="text-sm font-medium">WattPe Energy Private Limited</p>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-right">
                Bengaluru, Karnataka, India
                <br />
                <span className="text-xs">
                  (Full registered address to be published here.)
                </span>
              </p>
            </div>
          </Container>
        </section>
      </Reveal>

      <CtaBanner layout="split" className="pt-3 pb-8 sm:pt-4 sm:pb-10" />
    </>
  );
}
