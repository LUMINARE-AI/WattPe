import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

export function Hero() {
  return (
    <section className="bg-brand-void relative overflow-hidden">
      {/* Faint sunburst — concentric rings + a few spokes, not a flat blur circle */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-48 -right-32 size-[900px] opacity-50"
        viewBox="0 0 900 900"
        fill="none"
      >
        <g stroke="var(--brand-green)" strokeWidth="1" opacity="0.35">
          <circle cx="450" cy="450" r="120" />
          <circle cx="450" cy="450" r="220" />
          <circle cx="450" cy="450" r="320" />
          <circle cx="450" cy="450" r="420" />
        </g>
        <g stroke="var(--brand-teal)" strokeWidth="1" opacity="0.25">
          <line x1="450" y1="450" x2="900" y2="120" />
          <line x1="450" y1="450" x2="900" y2="450" />
          <line x1="450" y1="450" x2="900" y2="780" />
          <line x1="450" y1="450" x2="620" y2="900" />
        </g>
      </svg>

      <Container className="relative grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="border-brand-navy-light/70 bg-brand-navy-light/50 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-white">
            <Sparkles className="text-brand-sun size-4" />
            Now live across Bengaluru &amp; Mumbai
          </div>

          <h1 className="mt-6 max-w-xl text-4xl leading-[0.98] font-extrabold tracking-tight text-balance text-white sm:text-6xl">
            Solar,
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_var(--brand-green)]">
              beyond
            </span>{" "}
            rooftops.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-white/70">
            Reserve capacity in a shared solar plant and offset your
            electricity bills every month — no installation, no maintenance,
            no roof required.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-brand-green hover:bg-brand-green-hover shadow-brand-green/25 h-11 rounded-full px-6 text-white shadow-lg"
              render={<Link href="/projects" />}
            >
              Reserve your capacity <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/how-it-works" />}
            >
              See how it works
            </Button>
          </div>

          <div className="mt-9 flex items-center gap-3.5">
            <div className="flex">
              {["A", "R", "K", "+"].map((letter, i) => (
                <span
                  key={letter}
                  style={{ marginLeft: i === 0 ? 0 : "-8px" }}
                  className="border-brand-void from-brand-green to-brand-teal flex size-7 items-center justify-center rounded-full border-2 bg-gradient-to-br text-[10px] font-bold text-white"
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/55">
              <strong className="font-semibold text-white">20,000+</strong>{" "}
              bills already offset with solar credits
            </p>
          </div>
        </div>

        <DashboardPreview />
      </Container>
    </section>
  );
}
