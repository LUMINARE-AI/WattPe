import { Container } from "@/components/shared/container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-brand-void relative overflow-hidden">
      <div
        aria-hidden
        className="bg-brand-green/20 pointer-events-none absolute top-[-30%] right-[-10%] size-[420px] rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-brand-cyan/15 pointer-events-none absolute bottom-[-40%] left-[-5%] size-[360px] rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-brand-sun/10 pointer-events-none absolute top-[20%] left-[30%] size-[280px] rounded-full blur-3xl"
      />
      <Container className="relative py-20 sm:py-28">
        {eyebrow && (
          <p className="text-brand-sun mb-3 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-lg text-pretty text-white/70">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
