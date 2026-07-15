import { Check, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const ROWS: { old: string; wattpe: string }[] = [
  {
    old: "₹1.5L+ upfront for panels and installation",
    wattpe: "Zero installation cost — reserve capacity instantly",
  },
  {
    old: "Weeks of site surveys, permits, and approvals",
    wattpe: "Live in your city? Start saving within minutes",
  },
  {
    old: "You handle repairs, cleaning, and maintenance",
    wattpe: "The plant operator maintains everything for you",
  },
  {
    old: "Savings capped by your roof's size and shade",
    wattpe: "Scale your reserved capacity up or down anytime",
  },
  {
    old: "Stuck with your investment if you relocate",
    wattpe: "Credits move with you — transfer in a few clicks",
  },
];

export function ComparisonSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The difference"
          title="Rooftop solar vs. WattPe"
          align="center"
        />

        <div className="mt-14 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-2">
            <div className="bg-muted/50 px-5 py-4 text-center text-sm font-semibold text-muted-foreground sm:px-8">
              Rooftop solar
            </div>
            <div className="bg-brand-green/10 text-brand-green-hover px-5 py-4 text-center text-sm font-semibold sm:px-8">
              WattPe
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.wattpe}
              className={
                i % 2 === 0
                  ? "grid grid-cols-2 bg-card"
                  : "grid grid-cols-2 bg-muted/20"
              }
            >
              <div className="flex items-start gap-3 border-r border-border/60 px-5 py-5 sm:px-8">
                <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">{row.old}</p>
              </div>
              <div className="flex items-start gap-3 px-5 py-5 sm:px-8">
                <Check className="text-brand-green mt-0.5 size-4 shrink-0" />
                <p className="text-sm font-medium">{row.wattpe}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
