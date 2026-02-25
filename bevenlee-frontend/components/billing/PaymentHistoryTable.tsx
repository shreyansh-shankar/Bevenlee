import type { Payment } from "@/lib/billing";

interface Props {
  payments: Payment[];
}

export default function PaymentHistoryTable({ payments }: Props) {
  const PLAN_NAMES: Record<number, string> = {
    0: "Free",
    1: "Pro",
    2: "Premium",
  };

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <p className="text-sm text-muted-foreground">
          All your past transactions.
        </p>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No payments yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium">Date</th>
                <th className="text-left py-2 pr-4 font-medium">Plan</th>
                <th className="text-left py-2 pr-4 font-medium">Amount</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-b last:border-0">
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    {PLAN_NAMES[p.plan_id] ?? "Unknown"}
                  </td>
                  <td className="py-3 pr-4">
                    ${(p.amount / 100).toFixed(2)}{" "}
                    <span className="text-muted-foreground uppercase text-xs">
                      {p.currency}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}