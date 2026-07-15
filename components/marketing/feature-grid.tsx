import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Activity,
  Receipt,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Activity,
    title: "Real-time monitoring",
    description:
      "Track your reserved plant's generation and your accumulated credits from your WattPe dashboard, updated monthly.",
  },
  {
    icon: Receipt,
    title: "Multi-biller support",
    description:
      "Have more than one electricity connection? Split your reserved capacity across multiple bills and DISCOM accounts.",
  },
  {
    icon: RefreshCw,
    title: "Credit rollover",
    description:
      "Unused credits in a given month roll over automatically — nothing generated on your behalf ever goes to waste.",
  },
  {
    icon: ShieldCheck,
    title: "Verified, audited plants",
    description:
      "Every project is metered and independently verifiable, with generation history available before you reserve.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Built in"
          title="Everything you'd expect from a modern solar platform"
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-border bg-card hover:border-primary/40 flex gap-4 rounded-2xl border p-6 transition-colors hover:shadow-md"
            >
              <div className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
                <feature.icon className="text-primary size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
