"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { LibraryCard } from "@/components/library/LibraryCard"
import { CloneModal } from "@/components/library/CloneModal"
import { LibraryFilters } from "@/components/library/LibraryFilters"
import { Button } from "@/components/ui/button"
import { Loader2, Library } from "lucide-react"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"
import {
  fetchLibrary,
  toggleLibraryLike,
  LibraryItem,
  LibraryFilter,
} from "@/lib/library/api"

export default function LibraryPage() {
  const router = useRouter()

  // ── Auth / user state ──────────────────────────────────────────────────
  const [userId, setUserId] = useState<string | null>(null)
  const [planId, setPlanId] = useState<number | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // ── Library state ──────────────────────────────────────────────────────
  const [items, setItems] = useState<LibraryItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // ── Filters ────────────────────────────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>("all")
  const [likedOnly, setLikedOnly] = useState(false)

  // ── Interactions ───────────────────────────────────────────────────────
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set())
  const [cloneTarget, setCloneTarget] = useState<LibraryItem | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // ── 1. Resolve user + plan on mount ───────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login?redirect=/library")
          return
        }

        setUserId(user.id)

        // Read plan from users table directly via Supabase client
        const { data: profile } = await getSupabaseBrowserClient()
          .from("users")
          .select("subscribed_plan")
          .eq("user_id", user.id)
          .single()

        setPlanId(profile?.subscribed_plan ?? 0)
      } catch {
        router.push("/login?redirect=/library")
      } finally {
        setAuthLoading(false)
      }
    }

    init()
  }, [router])

  // ── 2. Load library when user / filters change ────────────────────────
  const loadLibrary = useCallback(
    async (targetPage: number, replace: boolean) => {
      if (!userId) return

      targetPage === 1 ? setIsLoading(true) : setIsLoadingMore(true)
      setFetchError(null)

      try {
        const result = await fetchLibrary({
          userId,
          itemType: activeFilter,
          likedOnly,
          page: targetPage,
        })

        setItems(prev => replace ? result.items : [...prev, ...result.items])
        setHasMore(result.has_more)
        setPage(targetPage)
      } catch (err: any) {
        setFetchError(err.message ?? "Failed to load library")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [userId, activeFilter, likedOnly]
  )

  useEffect(() => {
    if (!userId || planId === null) return

    // Gate: free users see upgrade modal instead of content
    if (planId === 0) {
      setShowUpgrade(true)
      return
    }

    loadLibrary(1, true)
  }, [userId, planId, activeFilter, likedOnly, loadLibrary])

  // ── 3. Like toggle ────────────────────────────────────────────────────
  async function handleLike(itemId: string) {
    if (!userId || likingIds.has(itemId)) return

    setLikingIds(prev => new Set(prev).add(itemId))

    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.item_id === itemId
          ? {
              ...item,
              user_liked: !item.user_liked,
              like_count: item.user_liked
                ? item.like_count - 1
                : item.like_count + 1,
            }
          : item
      )
    )

    try {
      await toggleLibraryLike(itemId, userId)
    } catch {
      // Revert optimistic update on failure
      setItems(prev =>
        prev.map(item =>
          item.item_id === itemId
            ? {
                ...item,
                user_liked: !item.user_liked,
                like_count: item.user_liked
                  ? item.like_count - 1
                  : item.like_count + 1,
              }
            : item
        )
      )
    } finally {
      setLikingIds(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  // ── 4. Filter change resets to page 1 ─────────────────────────────────
  function handleFilterChange(f: LibraryFilter) {
    setActiveFilter(f)
    setItems([])
    setPage(1)
  }

  function handleLikedOnlyChange(v: boolean) {
    setLikedOnly(v)
    setItems([])
    setPage(1)
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Library className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Library</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Browse and clone courses and roadmaps shared by the community.
          </p>
        </div>

        {/* ── Filters ── */}
        <LibraryFilters
          activeFilter={activeFilter}
          likedOnly={likedOnly}
          onFilterChange={handleFilterChange}
          onLikedOnlyChange={handleLikedOnlyChange}
        />

        {/* ── Content ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm text-destructive">{fetchError}</p>
            <Button variant="outline" size="sm" onClick={() => loadLibrary(1, true)}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="text-muted-foreground text-sm">
              {likedOnly
                ? "You haven't liked anything yet."
                : "No items in the library yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <LibraryCard
                  key={item.item_id}
                  item={item}
                  onLike={handleLike}
                  onClone={setCloneTarget}
                  isLiking={likingIds.has(item.item_id)}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => loadLibrary(page + 1, false)}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Clone modal ── */}
      {userId && (
        <CloneModal
          item={cloneTarget}
          userId={userId}
          onClose={() => setCloneTarget(null)}
        />
      )}

      {/* ── Upgrade gate for free users ── */}
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => {
          setShowUpgrade(false)
          router.push("/")
        }}
        message="The library is available on Pro and above. Upgrade to browse and clone community courses and roadmaps."
      />
    </>
  )
}