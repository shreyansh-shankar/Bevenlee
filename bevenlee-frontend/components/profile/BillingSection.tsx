import Link from "next/link";
import type { SubscriptionInfo } from "@/lib/types/user";

interface Props {
  subscription: SubscriptionInfo;
}

export default function BillingSection({ subscription }: Props ) {
  return (
    <section className="border rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-lg">Billing & Subscription</h2>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{subscription.plan_name}</p>
          <p className="text-sm text-muted-foreground">
            {subscription.status === "active"
              ? "Active subscription"
              : "No active subscription"}
          </p>
        </div>

        <Link
          href="/billing"
          className="px-4 py-2 rounded-lg border hover:bg-muted"
        >
          Manage Billing
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        Courses used: {subscription.courses_used} /{" "}
        {subscription.courses_limit}
      </div>
    </section>
  );
}