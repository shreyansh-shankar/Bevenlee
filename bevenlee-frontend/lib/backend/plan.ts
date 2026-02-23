export async function fetchUserPlan(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch user plan")
  }

  return res.json()
}