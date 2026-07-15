import { auth } from "@/lib/auth";
import { GenerationChart } from "@/components/dashboard/generation-chart";
import { getPrimaryReservation, getUserGenerationSeries } from "@/lib/data/dashboard";

export default async function GenerationPage() {
  const session = await auth();
  const reservation = await getPrimaryReservation(session!.user.id);

  if (!reservation) {
    return <p className="text-muted-foreground text-sm">No reservation yet.</p>;
  }

  const generation = await getUserGenerationSeries(
    reservation.projectId,
    Number(reservation.capacityKW),
    Number(reservation.project.capacityKW),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Generation</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your {Number(reservation.capacityKW)} kW share of {reservation.project.name}&apos;s output.
        </p>
      </div>

      <GenerationChart data={generation} />

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Month</th>
              <th className="px-4 py-2 text-right font-medium">Generation (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {generation.map((point) => (
              <tr key={point.month} className="border-border/60 border-t">
                <td className="px-4 py-2.5">{point.month}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {point.kWh.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
