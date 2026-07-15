import { auth } from "@/lib/auth";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getUserCreditLedger } from "@/lib/data/dashboard";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function SavingsPage() {
  const session = await auth();
  const ledger = await getUserCreditLedger(session!.user.id);

  const totalSavings = ledger.reduce((sum, e) => sum + e.savingsAmount, 0);
  const totalUnits = ledger.reduce((sum, e) => sum + e.unitsAllocated, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Savings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every credit applied to your bill, month by month.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard label="Total savings to date" value={inr.format(totalSavings)} />
        <KpiCard label="Total units credited" value={totalUnits.toFixed(0)} />
        <KpiCard
          label="Avg. monthly savings"
          value={inr.format(ledger.length ? totalSavings / ledger.length : 0)}
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Period</th>
              <th className="px-4 py-2 text-right font-medium">Units</th>
              <th className="px-4 py-2 text-right font-medium">Credit rate</th>
              <th className="px-4 py-2 text-right font-medium">Credit amount</th>
              <th className="px-4 py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ledger
              .slice()
              .reverse()
              .map((entry) => (
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
                    ₹{entry.creditRatePerUnit.toFixed(2)}
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
