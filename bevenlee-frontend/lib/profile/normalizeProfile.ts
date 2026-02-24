import type { SubscriptionInfo } from "@/lib/types/user";
import type { UserAccountInfo } from "@/lib/types/user";

export function normalizeSubscription(
  sub: any
): SubscriptionInfo {
  const validStatuses = ["active", "inactive", "trial", "canceled"];

  return {
    plan_name: sub.plan_name ?? "Free Plan",
    status: validStatuses.includes(sub.status)
      ? sub.status
      : "inactive",
    courses_used: sub.courses_used ?? 0,
    courses_limit: sub.courses_limit ?? 0,
  };
}

export function normalizeAccountInfo(user: any): UserAccountInfo {
  return {
    email: user.email,
    provider:
      user.provider === "google" ? "google" : "email",
    created_at: user.created_at,
  };
}