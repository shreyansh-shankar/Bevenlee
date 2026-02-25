import { getSubscription } from "@/lib/billing";

export interface UserProfileResponse {
  name: string;
  email: string;
  avatar_url: string | null;
  provider: "google" | "email";
  created_at: string;
  subscription: {
    plan_name: string;
    status: "active" | "inactive" | "trial" | "canceled";
    courses_used: number;
    courses_limit: number;
  };
}

export async function getUserProfile(
  userId: string
): Promise<UserProfileResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${userId}`,
    { cache: "no-store" }
  );

  const subscription = await getSubscription(userId);

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();
  const profile = data.profile;

  return {
    name: profile.full_name ?? "User",
    email: profile.email,
    avatar_url: profile.avatar_url,
    provider: "google", // replace later if needed
    created_at: profile.created_at,

    subscription: {
      plan_name: subscription.plan_name,
      status: subscription.is_active ? "active" : "inactive",
      courses_used: 0,        // keep as-is, you track this elsewhere
      courses_limit: 7,       // your normalizeSubscription handles this
    },
  };
}

export async function updateUserProfile(
  userId: string,
  fullName: string
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        full_name: fullName,
        avatar_url: "",
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }
}