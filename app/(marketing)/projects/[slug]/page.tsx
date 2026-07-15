import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Zap, Leaf, TreePine, CloudOff } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  type ProjectSummary,
} from "@/lib/data/projects";
import { getActivePlans, getEngineAssumptions } from "@/lib/data/pricing";
import { computePlanEconomics } from "@/lib/pricing-engine/planEconomics";

export const revalidate = 3600;

// --- Sustainability impact estimate ---------------------------------------
// The data layer doesn't yet track per-project generation history, so this
// approximates lifetime impact from nameplate capacity using published
// grid-average assumptions rather than metered output. If a generation
// data source becomes available, replace this with actual kWh-produced figures.
const AVG_SUN_HOURS_PER_DAY = 4.5; // conservative Indian grid-tied solar yield
const GRID_EMISSION_FACTOR_KG_CO2_PER_KWH = 0.82; // India CEA grid emission factor (approx.)
const KG_CO2_ABSORBED_PER_TREE_PER_YEAR = 21; // rough mature-tree offset

function estimateSustainabilityImpact(capacityKW: number) {
  const annualKWh = capacityKW * AVG_SUN_HOURS_PER_DAY * 365;
  const annualCo2AvoidedKg = annualKWh * GRID_EMISSION_FACTOR_KG_CO2_PER_KWH;
  const treeEquivalent = Math.round(
    annualCo2AvoidedKg / KG_CO2_ABSORBED_PER_TREE_PER_YEAR,
  );
  return {
    annualKWh: Math.round(annualKWh),
    annualCo2AvoidedTonnes: annualCo2AvoidedKg / 1000,
    treeEquivalent,
  };
}

const STATUS_META: Record<
  ProjectSummary["status"],
  { label: string; badgeVariant: "default" | "secondary" | "outline"; description: string }
> = {
  UPCOMING: {
    label: "Opening soon",
    badgeVariant: "outline",
    description: "This plant hasn't opened for reservations yet.",
  },
  ACTIVE: {
    label: "Live — accepting reservations",
    badgeVariant: "default",
    description: "This plant is generating and has capacity available to reserve.",
  },
  FULL: {
    label: "Fully reserved",
    badgeVariant: "secondary",
    description: "All capacity in this plant has been reserved.",
  },
  CLOSED: {
    label: "Closed",
    badgeVariant: "outline",
    description: "This plant is no longer accepting or servicing reservations.",
  },
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description:
      project.description ??
      `Reserve capacity in ${project.name}, a ${project.capacityKW} kW WattPe community solar plant in ${project.state}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, plans, assumptions] = await Promise.all([
    getProjectBySlug(slug),
    getActivePlans(),
    getEngineAssumptions(),
  ]);

  if (!project) notFound();

  const operationalUntilYear = new Date(project.operationalUntil).getFullYear();
  const commissionedYear = project.commissionedAt
    ? new Date(project.commissionedAt).getFullYear()
    : null;
  const statusMeta = STATUS_META[project.status];
  const impact = estimateSustainabilityImpact(project.capacityKW);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description:
      project.description ?? `A ${project.capacityKW} kW WattPe community solar plant.`,
    brand: { "@type": "Brand", name: "WattPe" },
    areaServed: project.state,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-brand-void relative overflow-hidden">
        <div
          aria-hidden
          className="bg-brand-sun/15 pointer-events-none absolute top-[-30%] right-[-10%] size-[420px] rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="bg-brand-leaf/10 pointer-events-none absolute bottom-[-40%] left-[-5%] size-[360px] rounded-full blur-3xl"
        />
        <Container className="relative py-20 sm:py-28">
          <Badge variant={statusMeta.badgeVariant} className="h-6 px-3 text-xs">
            {statusMeta.label}
          </Badge>
          <h1 className="font-heading mt-4 text-4xl font-bold text-white sm:text-5xl">
            {project.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {project.state}
              {project.discom ? ` · ${project.discom}` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              Operational until {operationalUntilYear}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-4" />
              {project.capacityKW} kW capacity
            </span>
          </div>
          {project.description && (
            <p className="mt-6 max-w-2xl text-white/70">{project.description}</p>
          )}
        </Container>
      </section>

      {/* Project overview */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)]">
            <div className="border-border border-b px-6 py-4">
              <h2 className="font-heading text-lg font-bold">Project overview</h2>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Capacity</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {project.capacityKW} kW
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Reservation status</TableCell>
                  <TableCell className="text-right font-medium">{statusMeta.label}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Operational since</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {/* commissionedAt is nullable in the schema for plants pending commissioning */}
                    {commissionedYear ?? "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Operational until</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {operationalUntilYear}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">State / DISCOM</TableCell>
                  <TableCell className="text-right font-medium">
                    {project.state}
                    {project.discom ? ` · ${project.discom}` : ""}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Sustainability impact */}
          <div className="from-brand-green to-brand-green-hover relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white sm:p-8">
            <div
              aria-hidden
              className="bg-brand-leaf/25 pointer-events-none absolute top-[-20%] right-[-15%] size-56 rounded-full blur-3xl"
            />
            <div className="relative flex items-center gap-2">
              <Leaf className="size-5" />
              <h2 className="font-heading text-lg font-bold">Sustainability impact</h2>
            </div>
            <p className="relative mt-1 text-xs text-white/60">
              Estimated from nameplate capacity — not metered generation.
            </p>
            <div className="relative mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <CloudOff className="size-5 text-white/80" />
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {impact.annualCo2AvoidedTonnes.toFixed(1)}
                </p>
                <p className="text-xs text-white/70">tonnes CO₂ avoided / yr</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <TreePine className="size-5 text-white/80" />
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {impact.treeEquivalent.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-white/70">trees planted equivalent</p>
              </div>
            </div>
            <p className="relative mt-4 text-xs text-white/60">
              ≈ {impact.annualKWh.toLocaleString("en-IN")} kWh generated per year at this
              plant&apos;s capacity.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="font-heading text-2xl font-bold">
            Choose your plan
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Every plan credits your bill for the tenure shown, at the credit
            rate locked in when you reserve.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const economics = computePlanEconomics(plan, assumptions);
              return (
                <Card
                  key={plan.code}
                  className="border-border/80 hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {plan.tenureYears}-year tenure
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <Row label="Credit rate" value={`₹${plan.creditRatePerUnit.toFixed(2)}/unit`} />
                    <Row label="Fee" value={`₹${(economics.feePerKW / 1000).toFixed(1)}/W`} />
                    <Row
                      label="Refund at end"
                      value={plan.refundPct > 0 ? `${plan.refundPct}%` : "—"}
                    />
                    <Row
                      label="Target return"
                      value={`${plan.targetXirrPct.toFixed(1)}%`}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              disabled={project.status === "FULL" || project.status === "CLOSED"}
              render={<Link href="/signup" />}
            >
              {project.status === "FULL"
                ? "Fully reserved"
                : `Reserve capacity in ${project.name}`}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
