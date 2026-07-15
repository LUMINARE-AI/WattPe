import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CloudOff, Zap, PiggyBank, type LucideIcon } from "lucide-react";

const PROPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CloudOff,
    title: "No installation",
    description:
      "No panels on your roof, no site visits, no maintenance contracts. Just reserve capacity in a plant that's already generating.",
  },
  {
    icon: Zap,
    title: "Instant activation",
    description:
      "Link your utility account and start earning credits on your very next bill cycle — no lengthy commissioning wait.",
  },
  {
    icon: PiggyBank,
    title: "Maximized savings",
    description:
      "Credits step up over time to track rising grid tariffs, so your savings compound instead of eroding with inflation.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why WattPe"
          title="All the upside of solar, none of the hassle"
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PROPS.map((item) => (
            <div
              key={item.title}
              className="border-border bg-card hover:border-primary/40 group rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-accent group-hover:bg-primary flex size-11 items-center justify-center rounded-xl transition-colors">
                <item.icon className="text-primary group-hover:text-primary-foreground size-5.5 transition-colors" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
