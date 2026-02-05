export interface CreateCoursePayload {
  user_id: string
  title: string
  purpose?: string
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
}

export async function createCourse(payload: CreateCoursePayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to create course")
  }

  return res.json()
}
