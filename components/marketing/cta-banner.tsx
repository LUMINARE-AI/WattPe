import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export function CtaBanner({
  title = "Ready to start saving?",
  description = "Check which projects are live in your city and see your personalised savings forecast in under a minute.",
  href = "/projects",
  cta = "Explore projects",
  className,
  layout = "stacked",
}: {
  title?: string;
  description?: string;
  href?: string;
  cta?: string;
  className?: string;
  layout?: "stacked" | "split";
}) {
  return (
    <section className={cn("py-8 sm:py-12", className)}>
      <Container className="lg:px-6">
        <div
          className={cn(
            "from-brand-green via-brand-cyan to-brand-void relative overflow-hidden rounded-3xl bg-gradient-to-br px-6 sm:px-10",
            layout === "split"
              ? "flex flex-col items-start gap-6 py-8 text-left md:flex-row md:items-center md:justify-between md:py-10"
              : "px-6 py-12 text-center sm:px-10 sm:py-14",
          )}
        >
          <div
            aria-hidden
            className="bg-brand-sun/30 pointer-events-none absolute top-0 right-0 size-72 -translate-y-1/3 translate-x-1/3 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-brand-leaf/20 pointer-events-none absolute bottom-0 left-0 size-64 translate-y-1/3 -translate-x-1/3 rounded-full blur-3xl"
          />
          <div className={layout === "split" ? "relative max-w-2xl" : undefined}>
          <h2 className="font-heading relative text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p
            className={cn(
              "relative mt-3 max-w-xl text-white/70",
              layout === "stacked" && "mx-auto mt-4",
            )}
          >
            {description}
          </p>
          </div>
          <Button
            size="lg"
            className={cn(
              "bg-white text-brand-void hover:bg-white/90 relative h-11 shrink-0 px-6 shadow-lg",
              layout === "stacked" && "mt-8",
            )}
            render={<Link href={href} />}
          >
            {cta} <ArrowRight className="size-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
