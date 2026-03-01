import { getAuthToken } from "@/lib/auth/getAuthToken"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface Roadmap {
  roadmap_id: string
  user_id: string
  title: string
  description: string | null
  course_ids: string[]
  created_at: string
}

export interface RoadmapCourse {
  course_id: string
  title: string
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  purpose: string | null
  projects_enabled: boolean
  assignments_enabled: boolean
  topics: RoadmapTopic[]
  total_topics: number
  completed_topics: number
}

export interface RoadmapTopic {
  topic_id: string
  course_id: string
  title: string
  status: string
  position: number
}

export interface RoadmapDetail {
  roadmap: Roadmap
  courses: RoadmapCourse[]
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

function serverAuthHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  }
}

// ─────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────

export async function createRoadmap(payload: {
  user_id: string
  title: string
  description?: string
}): Promise<Roadmap> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.detail || "Failed to create roadmap")
  return data.roadmap
}

export async function getRoadmapsByUser(
  userId: string,
  accessToken: string
): Promise<Roadmap[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap/user/${userId}`,
    {
      cache: "no-store",
      headers: serverAuthHeaders(accessToken),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.detail || "Failed to fetch roadmaps")
  return data.roadmaps
}

export async function getRoadmapDetail(
  roadmapId: string,
  accessToken: string
): Promise<RoadmapDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap/detail/${roadmapId}`,
    {
      cache: "no-store",
      headers: serverAuthHeaders(accessToken),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.detail || "Failed to fetch roadmap detail")
  return data.roadmap
}

export async function saveRoadmap(
  roadmapId: string,
  payload: {
    title: string
    description: string | null
    course_ids: string[]
  }
): Promise<Roadmap> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap/save/${roadmapId}`,
    {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.detail || "Failed to save roadmap")
  return data.roadmap
}

export async function deleteRoadmap(roadmapId: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap/${roadmapId}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    }
  )

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.detail || "Failed to delete roadmap")
  }
}