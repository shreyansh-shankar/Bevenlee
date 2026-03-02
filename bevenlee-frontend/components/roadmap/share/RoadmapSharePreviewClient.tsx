"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, BookOpen, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
import { acceptRoadmapShare, RoadmapSharePreview } from "@/lib/course/roadmap-share"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  token: string
  preview: RoadmapSharePreview
  isAuthenticated: boolean
}

const ERROR_MESSAGES: Record<string, string> = {
  PLAN_UPGRADE_REQUIRED: "You need a Pro plan to accept shared roadmaps.",
  COURSE_LIMIT_EXCEEDED: "This roadmap's courses would exceed your course limit. Upgrade or free up space.",
  SHARE_EXPIRED: "This share link has expired.",
  UNKNOWN: "Something went wrong. Please try again.",
}

export function RoadmapSharePreviewClient({ token, preview, isAuthenticated }: Props) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [newRoadmapId, setNewRoadmapId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function handleAccept() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/share/roadmap/${token}`)
      return
    }

    setIsAccepting(true)
    setError(null)

    const result = await acceptRoadmapShare(token)
    setIsAccepting(false)

    if (result.success && result.roadmap_id) {
      setAccepted(true)
      setNewRoadmapId(result.roadmap_id)
      return
    }

    if (
      result.error_code === "PLAN_UPGRADE_REQUIRED" ||
      result.error_code === "COURSE_LIMIT_EXCEEDED"
    ) {
      setShowUpgrade(true)
      return
    }

    setError(ERROR_MESSAGES[result.error_code ?? "UNKNOWN"])
  }

  if (preview.is_expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <AlertTriangle className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Link expired</h1>
        <p className="text-muted-foreground max-w-sm">
          This share link is no longer valid. Ask the roadmap owner to generate a new one.
        </p>
      </div>
    )
  }

  if (accepted && newRoadmapId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <h1 className="text-2xl font-bold">Roadmap added!</h1>
        <p className="text-muted-foreground max-w-sm">
          <span className="font-medium">{preview.roadmap_title}</span> and all its courses have been added to your account.
        </p>
        <Button onClick={() => router.push(`/roadmap/${newRoadmapId}`)}>
          Open roadmap
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/40 px-6 py-5 border-b">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Shared by {preview.created_by_name}
                </p>
                <h1 className="text-xl font-bold leading-tight">{preview.roadmap_title}</h1>
                {preview.roadmap_description && (
                  <p className="text-sm text-muted-foreground mt-1">{preview.roadmap_description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center gap-6 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{preview.course_count} courses</span>
            </div>
            {preview.whiteboards && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>🗒️ Whiteboards included</span>
              </div>
            )}
          </div>

          <div className="px-6 py-5 flex flex-col gap-3">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {preview.expires_at && (
              <p className="text-xs text-muted-foreground">
                Link expires {new Date(preview.expires_at).toLocaleDateString()}
              </p>
            )}
            <Button className="w-full" onClick={handleAccept} disabled={isAccepting}>
              {isAccepting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding to your account…</>
              ) : isAuthenticated ? (
                "Add to my account"
              ) : (
                "Sign in to add this roadmap"
              )}
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                You'll be redirected back here after signing in.
              </p>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Upgrade to Pro to accept shared roadmaps and unlock unlimited course sharing."
      />
    </>
  )
}