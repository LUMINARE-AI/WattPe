import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

export function SavingsCalculatorSection({
  plan,
  assumptions,
  className = "py-20 sm:py-28",
}: {
  plan: PlanInput;
  assumptions: EngineAssumptions;
  className?: string;
}) {
  return (
    <section className={className}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <SectionHeading
            eyebrow="Try it yourself"
            title="See what you'd save"
            description="Enter your average monthly bill and desired savings to get an instant forecast."
            align="left"
            className="lg:max-w-md"
          />
          <SavingsCalculator plan={plan} assumptions={assumptions} />
        </div>
      </Container>
    </section>
  );
}
