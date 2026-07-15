import { auth } from "@/lib/auth";
import { getUserPayments } from "@/lib/data/dashboard";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUS_STYLES: Record<string, string> = {
  SUCCEEDED: "bg-brand-leaf/15 text-brand-green-hover",
  PENDING: "bg-accent text-accent-foreground",
  FAILED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
};

export default async function PaymentsPage() {
  const session = await auth();
  const payments = await getUserPayments(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Reservation fees and refunds on your account.
        </p>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
              <th className="px-4 py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-6 text-center">
                  No payments yet.
                </td>
              </tr>
            )}
            {payments.map((payment) => (
              <tr key={payment.id} className="border-border/60 border-t">
                <td className="px-4 py-2.5">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </td>
                <td className="px-4 py-2.5 capitalize">
                  {payment.type.replace("_", " ").toLowerCase()}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {inr.format(payment.amount)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[payment.status] ?? "bg-muted"}`}
                  >
                    {payment.status}
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
