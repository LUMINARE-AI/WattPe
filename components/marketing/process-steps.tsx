import { Container } from "@/components/shared/container";
import {
  SolarPanelIllustration,
  MeterIllustration,
  SavingsIllustration,
} from "@/components/marketing/illustrations";

const STEPS = [
  {
    number: "01",
    title: "Join a project & reserve capacity",
    description:
      "Browse live community solar plants near you, pick a plan, and reserve the capacity that matches your monthly bill.",
    Illustration: SolarPanelIllustration,
  },
  {
    number: "02",
    title: "Link your power provider account",
    description:
      "Connect your DISCOM account in a couple of clicks so credits can flow straight onto your electricity bill.",
    Illustration: MeterIllustration,
  },
  {
    number: "03",
    title: "Offset your bills with generated credits",
    description:
      "Every month, the plant's generation is converted into credits at your locked-in rate — automatically applied to your bill.",
    Illustration: SavingsIllustration,
  },
];

export function ProcessSteps() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              <step.Illustration className="h-28 w-auto" />
              <span className="text-primary/25 font-heading mt-4 block text-5xl font-bold">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {step.description}
              </p>
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="from-primary/30 absolute top-6 left-full hidden h-px w-10 -translate-x-5 bg-gradient-to-r to-transparent sm:block"
                />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
