import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthTokenServer()
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  }
}

export async function fetchUserPlan(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ user_id: userId }),
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch user plan")
  }
  return res.json()
}