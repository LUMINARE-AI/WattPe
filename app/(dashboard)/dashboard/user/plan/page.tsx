import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrimaryReservation } from "@/lib/data/dashboard";

export default async function PlanPage() {
  const session = await auth();
  const reservation = await getPrimaryReservation(session!.user.id);

  if (!reservation) {
    return <p className="text-muted-foreground text-sm">No active plan yet.</p>;
  }

  const startDate = reservation.startDate ? new Date(reservation.startDate) : null;
  const tenureEndsAt = reservation.tenureEndsAt ? new Date(reservation.tenureEndsAt) : null;
  const now = new Date();
  const yearsRemaining =
    tenureEndsAt && tenureEndsAt > now
      ? ((tenureEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Plan</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your reservation details for {reservation.project.name}.
        </p>
      </div>

      <Card className="border-border/80 rounded-2xl">
        <CardHeader>
          <CardTitle>{reservation.plan.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Detail label="Project" value={reservation.project.name} />
          <Detail label="Location" value={reservation.project.state} />
          <Detail label="Reserved capacity" value={`${Number(reservation.capacityKW)} kW`} />
          <Detail
            label="Credit rate"
            value={`₹${Number(reservation.plan.creditRatePerUnit).toFixed(2)}/unit`}
          />
          <Detail label="Tenure" value={`${reservation.plan.tenureYears} years`} />
          <Detail label="Years remaining" value={`${yearsRemaining} years`} />
          <Detail
            label="Refund at tenure end"
            value={Number(reservation.plan.refundPct) > 0 ? `${Number(reservation.plan.refundPct)}%` : "None"}
          />
          <Detail label="Status" value={reservation.status.replace("_", " ")} />
          <Detail
            label="Start date"
            value={startDate ? startDate.toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
          />
          <Detail
            label="Tenure ends"
            value={tenureEndsAt ? tenureEndsAt.toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-medium capitalize">{value}</p>
    </div>
  );
}
