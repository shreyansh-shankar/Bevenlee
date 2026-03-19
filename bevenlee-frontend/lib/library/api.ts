import { getAuthToken } from "@/lib/auth/getAuthToken"

export type LibraryItemType = "course" | "roadmap"
export type LibraryFilter = "all" | "course" | "roadmap"

export interface LibraryItem {
  item_id: string
  item_type: LibraryItemType
  source_id: string
  added_by: string
  title: string
  description: string | null
  whiteboards: boolean
  is_admin_pick: boolean
  created_at: string
  like_count: number
  user_liked: boolean
}

export interface LibraryPage {
  items: LibraryItem[]
  page: number
  page_size: number
  has_more: boolean
}

export interface CloneResult {
  success: boolean
  course_id?: string
  roadmap_id?: string
  error?: string
  error_code?: "PLAN_UPGRADE_REQUIRED" | "COURSE_LIMIT_EXCEEDED" | "TOPIC_LIMIT_EXCEEDED" | "UNKNOWN"
}

export interface AddToLibraryResult {
  success: boolean
  item?: LibraryItem
  error?: string
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// ── Fetch paginated library ────────────────────────────────────────────────

export async function fetchLibrary(params: {
  userId: string
  itemType?: LibraryFilter
  likedOnly?: boolean
  page?: number
}): Promise<LibraryPage> {
  const { userId, itemType = "all", likedOnly = false, page = 1 } = params

  const query = new URLSearchParams({
    user_id: userId,
    item_type: itemType,
    liked_only: String(likedOnly),
    page: String(page),
  })

  const res = await fetch(`/api/library?${query}`, {
    headers: await authHeaders(),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? "Failed to fetch library")
  }

  return res.json()
}

// ── Toggle like ────────────────────────────────────────────────────────────

export async function toggleLibraryLike(
  itemId: string,
  userId: string
): Promise<{ liked: boolean; like_count: number }> {
  const res = await fetch(`/api/library/${itemId}/like?user_id=${userId}`, {
    method: "POST",
    headers: await authHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to toggle like")
  }

  return res.json()
}

// ── Clone library item ─────────────────────────────────────────────────────

export async function cloneLibraryItem(
  itemId: string,
  userId: string,
  includeWhiteboards: boolean = false
): Promise<CloneResult> {
  const res = await fetch(`/api/library/${itemId}/clone`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ user_id: userId, include_whiteboards: includeWhiteboards }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? "Failed to clone item",
      error_code: data.error_code ?? "UNKNOWN",
    }
  }

  return { success: true, ...data }
}

// ── Add item to library ────────────────────────────────────────────────────

export async function addToLibrary(params: {
  userId: string
  itemType: LibraryItemType
  sourceId: string
  whiteboards?: boolean
}): Promise<AddToLibraryResult> {
  const res = await fetch("/api/library", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      user_id: params.userId,
      item_type: params.itemType,
      source_id: params.sourceId,
      whiteboards: params.whiteboards ?? false,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? "Failed to add to library",
    }
  }

  return { success: true, item: data.item }
}