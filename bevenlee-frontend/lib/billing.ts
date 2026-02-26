const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Subscription {
  plan_id: number;
  plan_name: string;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  subscription_status: "free" | "active" | "cancelled";
  creem_customer_id: string | null;
  creem_subscription_id: string | null;
  is_active: boolean;
  cancels_at_period_end: boolean;
  days_remaining: number | null;
}

export interface Payment {
  payment_id: string;
  user_id: string;
  plan_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  payment_provider_id: string;
  created_at: string;
}

export async function getSubscription(userId: string): Promise<Subscription> {
  const res = await fetch(`${BACKEND}/billing/subscription/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  const data = await res.json();
  return data.subscription;
}

export async function getPayments(userId: string): Promise<Payment[]> {
  const res = await fetch(`${BACKEND}/billing/payments/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch payments");
  const data = await res.json();
  return data.payments;
}

export async function createCheckout(
  userId: string,
  planId: number,
  billingCycle: "monthly" | "yearly"
): Promise<string> {
  const res = await fetch(`${BACKEND}/billing/create-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      plan_id: planId,
      billing_cycle: billingCycle,
    }),
  });
  if (!res.ok) throw new Error("Failed to create checkout");
  const data = await res.json();
  return data.checkout_url;
}

export async function cancelSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  const res = await fetch(`${BACKEND}/billing/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      subscription_id: subscriptionId,
    }),
  });
  if (!res.ok) throw new Error("Failed to cancel subscription");
}

export async function upgradeSubscription(
  userId: string,
  subscriptionId: string,
  planId: number,
  billingCycle: "monthly" | "yearly"
): Promise<void> {
  const res = await fetch(`${BACKEND}/billing/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      subscription_id: subscriptionId,
      plan_id: planId,
      billing_cycle: billingCycle,
    }),
  });
  if (!res.ok) throw new Error("Failed to upgrade subscription");
}