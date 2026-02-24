export interface UserProfile {
  name: string;
  email: string;
  avatar_url: string | null;
}

export interface SubscriptionInfo {
  plan_name: string;
  status: "active" | "inactive" | "trial" | "canceled";
  courses_used: number;
  courses_limit: number;
}

export interface UserAccountInfo {
  email: string;
  provider: "email" | "google";
  created_at: string;
}