import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "EV Charging",
  description: "WattPe EV charging — coming soon.",
};

export default function EvChargingPage() {
  return (
    <>
      <PageHero
        eyebrow="Coming soon"
        title="Solar-powered EV charging"
        description="We're extending the WattPe network to EV charging, powered by the same community solar plants."
      />
      <section className="py-20 sm:py-28">
        <Container className="max-w-lg text-center">
          <div className="relative mx-auto flex size-16 items-center justify-center">
            <div
              aria-hidden
              className="bg-brand-leaf/20 absolute inset-0 rounded-full blur-xl"
            />
            <div className="from-brand-green to-brand-leaf relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <Zap className="size-7 text-white" />
            </div>
          </div>
          <span className="bg-accent text-accent-foreground mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="size-3.5" />
            In the works
          </span>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            We&apos;ll announce EV charging availability on our{" "}
            <Link href="/faq" className="text-primary underline underline-offset-2">
              FAQ page
            </Link>{" "}
            and via email once it&apos;s ready.
          </p>
          <Button className="mt-8" size="lg" render={<Link href="/projects" />}>
            Explore solar projects instead
          </Button>
        </Container>
      </section>
    </>
  );
}
