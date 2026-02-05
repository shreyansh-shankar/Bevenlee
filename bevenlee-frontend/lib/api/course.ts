export interface CreateCoursePayload {
  user_id: string
  title: string
  purpose?: string
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  projects_enabled: boolean
  assignments_enabled: boolean
}

export interface Course {
  course_id: string
  user_id: string
  title: string
  purpose?: string | null
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
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

export async function getCoursesByUser(userId: string): Promise<Course[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to fetch courses")
  }

  const data = await res.json()

  // backend returns { status, courses }
  return data.courses as Course[]
}
