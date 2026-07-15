import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/marketing/project-card";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { CompatibilityChecker } from "@/components/marketing/compatibility-checker";
import { getActiveProjects } from "@/lib/data/projects";
import { getEngineAssumptions, getFlagshipPlan } from "@/lib/data/pricing";
import { getSupportedDiscoms } from "@/lib/data/discoms";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse live WattPe community solar projects, check your savings forecast, and confirm your electricity provider is supported.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const [projects, plan, assumptions, discoms] = await Promise.all([
    getActiveProjects(),
    getFlagshipPlan(),
    getEngineAssumptions(),
    getSupportedDiscoms(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Live community solar plants"
        description="Reserve capacity in a plant that's already generating — pick the one closest to you."
      />

      <Reveal>
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div
            aria-hidden
            className="bg-brand-leaf/10 pointer-events-none absolute top-[-10%] right-[-10%] size-[420px] rounded-full blur-3xl"
          />
          <Container className="relative">
            <SectionHeading eyebrow="Live now" title="Available projects" />
            {projects.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    creditRatePerUnit={plan.creditRatePerUnit}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border bg-card mt-10 rounded-3xl border p-12 text-center shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)]">
                <p className="text-muted-foreground text-sm">
                  No projects are live in your area just yet — check back soon.
                </p>
              </div>
            )}
          </Container>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-muted/40 py-20 sm:py-28">
          <Container className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <SavingsCalculator plan={plan} assumptions={assumptions} />
            <CompatibilityChecker discoms={discoms} />
          </Container>
        </section>
      </Reveal>
    </>
  );
}
