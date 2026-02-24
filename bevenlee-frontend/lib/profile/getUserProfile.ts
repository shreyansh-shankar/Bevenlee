export async function getUserProfile() {
  // temporary mock data

  return {
    name: "Shreyansh",
    email: "user@email.com",
    avatar_url: null,
    provider: "google",
    created_at: "2024-10-12T10:00:00Z",

    subscription: {
      plan_name: "Free Plan",
      status: "active",
      courses_used: 3,
      courses_limit: 7,
    },
  };
}