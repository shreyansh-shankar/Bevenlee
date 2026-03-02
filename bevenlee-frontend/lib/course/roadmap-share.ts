import { getAuthToken } from "@/lib/auth/getAuthToken"

export type ShareExpiry = "never" | "7d" | "30d"

export interface RoadmapShareLink {
  token: string
  url: string
  expires_at: string | null
  whiteboards: boolean
}

export interface RoadmapSharePreview {
  roadmap_title: string
  roadmap_description: string | null
  course_count: number
  created_by_name: string
  expires_at: string | null
  is_expired: boolean
  whiteboards: boolean
}

export interface AcceptRoadmapShareResult {
  success: boolean
  roadmap_id?: string
  error?: string
  error_code?: "PLAN_UPGRADE_REQUIRED" | "COURSE_LIMIT_EXCEEDED" | "SHARE_EXPIRED" | "UNKNOWN"
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function createRoadmapShareLink(
  roadmapId: string,
  expiry: ShareExpiry,
  whiteboards: boolean = false
): Promise<RoadmapShareLink> {
  const res = await fetch("/api/share/roadmap/create", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ roadmap_id: roadmapId, expiry, whiteboards }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? "Failed to create share link")
  }
  return res.json()
}

export async function fetchRoadmapSharePreview(
  token: string
): Promise<RoadmapSharePreview | null> {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
        : ""
    const res = await fetch(`${baseUrl}/api/share/roadmap/${token}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function acceptRoadmapShare(
  token: string
): Promise<AcceptRoadmapShareResult> {
  const res = await fetch(`/api/share/roadmap/${token}/accept`, {
    method: "POST",
    headers: await authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? "Failed to accept share",
      error_code: data.error_code ?? "UNKNOWN",
    }
  }
  return { success: true, roadmap_id: data.roadmap_id }
}