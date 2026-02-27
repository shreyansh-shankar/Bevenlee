import { getAuthToken } from "@/lib/auth/getAuthToken"

export interface StudySession {
  id?: string
  topic_id: string
  started_at: string   // ISO string
  duration_minutes: number
}

export interface SessionStats {
  sessions: StudySession[]
  today_minutes: number
  total_sessions: number
  streak_days: number
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function saveStudySession(
  topicId: string,
  startedAt: Date,
  durationMinutes: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/sessions/save", {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        topic_id: topicId,
        started_at: startedAt.toISOString(),
        duration_minutes: durationMinutes,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      return { success: false, error: data.error }
    }

    return { success: true }
  } catch {
    return { success: false, error: "Failed to save session" }
  }
}

export async function fetchSessionStats(topicId: string): Promise<SessionStats | null> {
  try {
    const token = await getAuthToken()
    const res = await fetch(`/api/sessions/stats?topicId=${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}