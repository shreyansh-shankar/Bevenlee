import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSubscription, getPayments } from "@/lib/billing";
import CurrentPlanCard from "./CurrentPlanCard";
import PaymentHistoryTable from "./PaymentHistoryTable";

export default async function BillingContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [subscription, payments] = await Promise.all([
    getSubscription(user.id),
    getPayments(user.id),
  ]);

  return (
    <div className="flex-1 px-10 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscription and payment history.
          </p>
        </div>
        <CurrentPlanCard subscription={subscription} userId={user.id} />
        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
}