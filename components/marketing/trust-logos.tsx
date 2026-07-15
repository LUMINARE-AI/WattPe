import { Container } from "@/components/shared/container";

const PARTNERS = ["Tata Power Solar", "IIM Bangalore", "Social Alpha", "NSE Emerge"];

export function TrustLogos() {
  return (
    <section className="border-border/60 border-y py-16 sm:py-20">
      <Container>
        <p className="text-muted-foreground text-center text-xs font-medium tracking-wide uppercase">
          Backed by &amp; partnered with
        </p>
        <div className="text-muted-foreground/70 mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm font-semibold">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="hover:text-primary transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
