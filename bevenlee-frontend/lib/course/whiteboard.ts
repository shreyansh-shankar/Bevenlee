// lib/course/whiteboard.ts
export interface SaveWhiteboardResult {
  success: boolean
  error?: string
}

export async function saveWhiteboardToBackend(documentId: string, data: any): Promise<SaveWhiteboardResult> {
  try {
    const res = await fetch("/api/whiteboard/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, snapshot: data }),
    })

    const result = await res.json()

    // Make sure we always return { success, error? }
    if (res.ok) {
      return { success: true }
    } else {
      return { success: false, error: result?.error || "Unknown error" }
    }
  } catch (err: any) {
    console.error("Error saving whiteboard:", err)
    return { success: false, error: err.message || "Unknown error" }
  }
}

export async function fetchWhiteboardFromBackend(documentId: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/whiteboard/load?documentId=${documentId}`)

    if (res.status === 403) {
      const data = await res.json()
      if (data?.error === "PLAN_UPGRADE_REQUIRED") {
        throw new Error("PLAN_UPGRADE_REQUIRED")
      }
    }

    if (!res.ok) return null

    const snapshot = await res.json()
    return snapshot ?? null

  } catch (err) {
    if (err instanceof Error && err.message === "PLAN_UPGRADE_REQUIRED") {
      throw err
    }

    console.error("Error fetching whiteboard:", err)
    return null
  }
}