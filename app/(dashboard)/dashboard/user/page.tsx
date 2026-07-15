import Link from "next/link";
import { Leaf, TreePine } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GenerationChart } from "@/components/dashboard/generation-chart";
import {
  getPrimaryReservation,
  getUserCreditLedger,
  getUserGenerationSeries,
} from "@/lib/data/dashboard";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Local, presentation-only estimate — no data-layer changes.
// India grid emission factor ~0.82 kg CO2/kWh avoided by solar generation;
// one mature tree offsets roughly 21 kg CO2/year.
function estimateSustainabilityImpact(totalKWh: number) {
  const CO2_KG_PER_KWH = 0.82;
  const CO2_KG_PER_TREE_PER_YEAR = 21;
  const co2AvoidedKg = totalKWh * CO2_KG_PER_KWH;
  const treesEquivalent = co2AvoidedKg / CO2_KG_PER_TREE_PER_YEAR;
  return { co2AvoidedKg, treesEquivalent };
}

export default async function DashboardOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;

  const reservation = await getPrimaryReservation(userId);

  if (!reservation) {
    return <EmptyState />;
  }

  const [ledger, generation] = await Promise.all([
    getUserCreditLedger(userId),
    getUserGenerationSeries(
      reservation.projectId,
      Number(reservation.capacityKW),
      Number(reservation.project.capacityKW),
    ),
  ]);

  const creditSavedToDate = ledger.reduce((sum, e) => sum + e.savingsAmount, 0);
  const totalGeneration = generation.reduce((sum, g) => sum + g.kWh, 0);
  const recent = ledger.slice(-5).reverse();
  const { co2AvoidedKg, treesEquivalent } =
    estimateSustainabilityImpact(totalGeneration);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {reservation.plan.name} · {reservation.project.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Credit saved to date" value={inr.format(creditSavedToDate)} />
        <KpiCard
          label="Capacity reserved"
          value={`${Number(reservation.capacityKW)} kW`}
        />
        <KpiCard
          label="Credit rate"
          value={`₹${Number(reservation.plan.creditRatePerUnit).toFixed(2)}/unit`}
          sub="vs grid tariff for reference"
        />
        <KpiCard
          label="Generation (12 mo)"
          value={`${totalGeneration.toFixed(0)} kWh`}
        />
      </div>

      <div className="from-brand-green/8 to-brand-leaf/8 border-brand-green/15 grid grid-cols-2 gap-4 rounded-2xl border bg-gradient-to-br p-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="bg-brand-green/10 flex size-10 shrink-0 items-center justify-center rounded-full">
            <Leaf className="text-brand-green-hover size-5" />
          </div>
          <div>
            <p className="font-heading text-xl font-semibold tabular-nums">
              {(co2AvoidedKg / 1000).toFixed(2)} t
            </p>
            <p className="text-muted-foreground text-xs">CO2 avoided (12 mo, est.)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-brand-leaf/15 flex size-10 shrink-0 items-center justify-center rounded-full">
            <TreePine className="text-brand-green-hover size-5" />
          </div>
          <div>
            <p className="font-heading text-xl font-semibold tabular-nums">
              {treesEquivalent.toFixed(0)}
            </p>
            <p className="text-muted-foreground text-xs">Trees-equivalent per year</p>
          </div>
        </div>
      </div>

      <GenerationChart data={generation} />

      <div className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border/60 flex items-center justify-between border-b p-4">
          <h2 className="font-medium">Recent bill-offset activity</h2>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard/user/savings" />}>
            View all
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Period</th>
              <th className="px-4 py-2 text-right font-medium">Units</th>
              <th className="px-4 py-2 text-right font-medium">Credit</th>
              <th className="px-4 py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((entry) => (
              <tr key={entry.id} className="border-border/60 border-t">
                <td className="px-4 py-2.5">
                  {new Date(entry.periodStart).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {entry.unitsAllocated.toFixed(0)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {inr.format(entry.creditAmount)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="bg-brand-leaf/15 text-brand-green-hover rounded-full px-2 py-0.5 text-xs font-medium">
                    {entry.offsetStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-heading text-2xl font-semibold">
        You haven&apos;t reserved capacity yet
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Browse live projects and reserve solar capacity to start seeing your
        generation and savings here.
      </p>
      <Button className="mt-6" render={<Link href="/projects" />}>
        Browse projects
      </Button>
    </div>
  );
}
