import { Leaf } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { ValueProps } from "@/components/marketing/value-props";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { ScrollSteps } from "@/components/marketing/scroll-steps";
import { SavingsCalculatorSection } from "@/components/marketing/savings-calculator-section";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { getEngineAssumptions, getFlagshipPlan } from "@/lib/data/pricing";

export const revalidate = 3600;

export default async function HomePage() {
  const [plan, assumptions] = await Promise.all([
    getFlagshipPlan(),
    getEngineAssumptions(),
  ]);

  return (
    <>
      <Hero />

      {/* Sustainability-forward impact strip, sits visually between the hero and value props. */}
      <section className="bg-brand-void relative -mt-px overflow-hidden pb-2">
        <Container className="flex items-center justify-center gap-2 pt-2 pb-6 text-center">
          <Leaf className="text-brand-leaf size-4 shrink-0" />
          <p className="text-sm text-white/60">
            Every kilowatt reserved on WattPe is real, metered solar
            generation — cutting grid demand and CO₂ emissions, one bill at a
            time.
          </p>
        </Container>
      </section>

      <Reveal>
        <ValueProps />
      </Reveal>
      <ScrollSteps />
      <Reveal>
        <SavingsCalculatorSection
          plan={plan}
          assumptions={assumptions}
          className="bg-muted/40 py-20 sm:py-28"
        />
      </Reveal>
      <Reveal>
        <ComparisonSection />
      </Reveal>
      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
