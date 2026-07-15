import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "WattPe is building community solar for India — reserve capacity in a shared plant and save on your electricity bill, no rooftop required.",
};

const TEAM = [
  { name: "Founding team", role: "Energy & Fintech", note: "Bios coming soon." },
  { name: "Engineering", role: "Platform & Metering", note: "Bios coming soon." },
  { name: "Operations", role: "Plant Partnerships", note: "Bios coming soon." },
];

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        eyebrow="About WattPe"
        title="Solar for everyone, not just rooftop owners"
        description="We believe clean energy savings shouldn't depend on owning a roof. WattPe lets anyone reserve capacity in a shared solar plant and save from day one."
      />

      <Reveal>
        <section className="py-20 sm:py-28">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="Our mission"
              title="Making solar accessible, one reservation at a time"
            />
            <div className="text-muted-foreground mt-6 space-y-4 text-base leading-relaxed">
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
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-muted/40 py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Team" title="Who's behind WattPe" align="center" />
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="border-border bg-card rounded-2xl border p-6 text-center shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)]"
                >
                  <div className="bg-accent text-accent-foreground mx-auto flex size-14 items-center justify-center rounded-full text-lg font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{member.note}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div
            aria-hidden
            className="bg-brand-leaf/10 pointer-events-none absolute top-1/2 left-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          />
          <Container className="relative max-w-3xl">
            <SectionHeading eyebrow="Registered office" title="Where to find us" />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              WattPe Energy Private Limited
              <br />
              Bengaluru, Karnataka, India
              <br />
              <span className="text-xs">
                (Full registered address to be published here.)
              </span>
            </p>
          </Container>
        </section>
      </Reveal>

      <CtaBanner />
    </>
  );
}
