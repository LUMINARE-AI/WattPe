import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { CreditFlowExplainer } from "@/components/marketing/credit-flow-explainer";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { SavingsCalculatorSection } from "@/components/marketing/savings-calculator-section";
import { Reveal } from "@/components/shared/reveal";
import { getEngineAssumptions, getFlagshipPlan } from "@/lib/data/pricing";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Process",
  description:
    "Reserve capacity in a shared solar plant, link your power provider account, and offset your bills with generated credits — no rooftop required.",
};

export default async function HowItWorksPage() {
  const [plan, assumptions] = await Promise.all([
    getFlagshipPlan(),
    getEngineAssumptions(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From sign-up to savings in three steps"
        description="No installation crews, no rooftop surveys. Just reserve capacity in a plant that's already live."
      />
      <ProcessSteps />
      <CreditFlowExplainer />
      <Reveal>
        <SavingsCalculatorSection plan={plan} assumptions={assumptions} />
      </Reveal>
      <FeatureGrid />
      <CtaBanner />
    </>
  );
}
