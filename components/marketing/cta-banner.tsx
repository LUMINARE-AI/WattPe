import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function CtaBanner({
  title = "Ready to start saving?",
  description = "Check which projects are live in your city and see your personalised savings forecast in under a minute.",
  href = "/projects",
  cta = "Explore projects",
}: {
  title?: string;
  description?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="py-24">
      <Container>
        <div className="from-brand-green via-brand-cyan to-brand-void relative overflow-hidden rounded-3xl bg-gradient-to-br px-8 py-20 text-center sm:px-16">
          <div
            aria-hidden
            className="bg-brand-sun/30 pointer-events-none absolute top-0 right-0 size-72 -translate-y-1/3 translate-x-1/3 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-brand-leaf/20 pointer-events-none absolute bottom-0 left-0 size-64 translate-y-1/3 -translate-x-1/3 rounded-full blur-3xl"
          />
          <h2 className="font-heading relative text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/70">
            {description}
          </p>
          <Button
            size="lg"
            className="bg-white text-brand-void hover:bg-white/90 relative mt-8 h-11 px-6 shadow-lg"
            render={<Link href={href} />}
          >
            {cta} <ArrowRight className="size-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
