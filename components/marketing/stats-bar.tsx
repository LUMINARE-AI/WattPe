import { Container } from "@/components/shared/container";
import { AnimatedCounter } from "@/components/marketing/animated-counter";

export type StatItem = { label: string; value: string };

export function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <section className="bg-brand-ink relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="from-brand-green/25 pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b to-transparent"
      />
      <Container className="relative grid grid-cols-2 gap-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-brand-teal-light font-heading text-3xl font-bold tabular-nums sm:text-4xl">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
