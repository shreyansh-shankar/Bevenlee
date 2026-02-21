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