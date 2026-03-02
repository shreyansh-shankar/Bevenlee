import { getAuthToken } from "@/lib/auth/getAuthToken"

export type ShareExpiry = "never" | "7d" | "30d"

export interface ShareLink {
  token: string
  url: string
  expires_at: string | null
  whiteboards: boolean
}

export interface SharePreview {
  course_title: string
  course_type: string
  course_status: string
  topic_count: number
  resource_count: number
  created_by_name: string
  expires_at: string | null
  is_expired: boolean
  whiteboards: boolean
}

export interface AcceptShareResult {
  success: boolean
  course_id?: string
  error?: string
  error_code?: "PLAN_UPGRADE_REQUIRED" | "COURSE_LIMIT_EXCEEDED" | "TOPIC_LIMIT_EXCEEDED" | "SHARE_EXPIRED" | "UNKNOWN"
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function createShareLink(
  courseId: string,
  expiry: ShareExpiry,
  whiteboards: boolean = false
): Promise<ShareLink> {
  const res = await fetch("/api/share/create", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ course_id: courseId, expiry, whiteboards }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? "Failed to create share link")
  }

  return res.json()
}

// No auth needed — preview is public
export async function fetchSharePreview(token: string): Promise<SharePreview | null> {
  try {
    // Relative URLs don't work server-side — need absolute URL
    const baseUrl =
      typeof window === "undefined"
        ? (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
        : ""
    const res = await fetch(`${baseUrl}/api/share/${token}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function acceptShare(token: string): Promise<AcceptShareResult> {
  const res = await fetch(`/api/share/${token}/accept`, {
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

  return { success: true, course_id: data.course_id }
}