"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Layers, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react"
import { acceptShare, SharePreview } from "@/lib/course/share"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  token: string
  preview: SharePreview
  isAuthenticated: boolean
}

const ERROR_MESSAGES: Record<string, string> = {
  PLAN_UPGRADE_REQUIRED: "You need a Pro plan to accept shared courses.",
  COURSE_LIMIT_EXCEEDED: "You've reached your course limit. Upgrade or delete a course to continue.",
  TOPIC_LIMIT_EXCEEDED: "This course has more topics than your plan allows.",
  SHARE_EXPIRED: "This share link has expired.",
  UNKNOWN: "Something went wrong. Please try again.",
}

export function SharePreviewClient({ token, preview, isAuthenticated }: Props) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [newCourseId, setNewCourseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function handleAccept() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/share/${token}`)
      return
    }

    setIsAccepting(true)
    setError(null)

    const result = await acceptShare(token)

    setIsAccepting(false)

    if (result.success && result.course_id) {
      setAccepted(true)
      setNewCourseId(result.course_id)
      return
    }

    if (result.error_code === "PLAN_UPGRADE_REQUIRED" ||
        result.error_code === "COURSE_LIMIT_EXCEEDED" ||
        result.error_code === "TOPIC_LIMIT_EXCEEDED") {
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
          This share link is no longer valid. Ask the course owner to generate a new one.
        </p>
      </div>
    )
  }

  if (accepted && newCourseId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <h1 className="text-2xl font-bold">Course added!</h1>
        <p className="text-muted-foreground max-w-sm">
          <span className="font-medium">{preview.course_title}</span> has been added to your courses.
        </p>
        <Button onClick={() => router.push(`/course/${newCourseId}`)}>
          Open course
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md border rounded-xl bg-card shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-muted/40 px-6 py-5 border-b">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Shared by {preview.created_by_name}
                </p>
                <h1 className="text-xl font-bold leading-tight">
                  {preview.course_title}
                </h1>
              </div>
              <Badge variant="secondary" className="shrink-0 mt-0.5">
                {preview.course_status}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 flex items-center gap-6 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="w-4 h-4" />
              <span>{preview.topic_count} topics</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{preview.resource_count} resources</span>
            </div>
            <Badge variant="outline">{preview.course_type}</Badge>
          </div>

          {/* CTA */}
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

            <Button
              className="w-full"
              onClick={handleAccept}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to your courses…
                </>
              ) : isAuthenticated ? (
                "Add to my courses"
              ) : (
                "Sign in to add this course"
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
        message="Upgrade to Pro to accept shared courses and unlock unlimited course sharing."
      />
    </>
  )
}