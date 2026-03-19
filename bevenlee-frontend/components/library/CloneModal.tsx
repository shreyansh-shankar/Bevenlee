"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { LibraryItem, cloneLibraryItem, CloneResult } from "@/lib/library/api"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  item: LibraryItem | null
  userId: string
  onClose: () => void
}

const ERROR_MESSAGES: Record<string, string> = {
  PLAN_UPGRADE_REQUIRED: "The library is only available on Pro and above.",
  COURSE_LIMIT_EXCEEDED: "You've reached your course limit. Upgrade or delete a course to continue.",
  TOPIC_LIMIT_EXCEEDED: "This course has more topics than your plan allows.",
  UNKNOWN: "Something went wrong. Please try again.",
}

export function CloneModal({ item, userId, onClose }: Props) {
  const router = useRouter()
  const [includeWhiteboards, setIncludeWhiteboards] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [result, setResult] = useState<CloneResult | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const isOpen = !!item

  function handleOpenChange(val: boolean) {
    if (!val) {
      // reset on close
      setResult(null)
      setIncludeWhiteboards(false)
      onClose()
    }
  }

  async function handleClone() {
    if (!item) return

    setIsCloning(true)
    const res = await cloneLibraryItem(item.item_id, userId, includeWhiteboards)
    setIsCloning(false)

    if (res.success) {
      setResult(res)
      return
    }

    if (
      res.error_code === "PLAN_UPGRADE_REQUIRED" ||
      res.error_code === "COURSE_LIMIT_EXCEEDED" ||
      res.error_code === "TOPIC_LIMIT_EXCEEDED"
    ) {
      setShowUpgrade(true)
      return
    }

    setResult(res)
  }

  function handleNavigate() {
    if (!result) return
    if (result.course_id) router.push(`/course/${result.course_id}`)
    else if (result.roadmap_id) router.push(`/roadmap/${result.roadmap_id}`)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">

          {/* ── Success state ── */}
          {result?.success ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Cloned successfully!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{item?.title}</span> has been added to your{" "}
                  {item?.item_type === "course" ? "courses" : "roadmaps"}.
                </p>
              </div>
              <Button onClick={handleNavigate} className="w-full">
                Open {item?.item_type}
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Clone to your account</DialogTitle>
                <DialogDescription>
                  A full copy of{" "}
                  <span className="font-medium text-foreground">{item?.title}</span>{" "}
                  will be added to your{" "}
                  {item?.item_type === "course" ? "courses" : "roadmaps"}.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 pt-2">

                {/* Whiteboard toggle — only shown if item allows it */}
                {item?.whiteboards && (
                  <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">Include whiteboard notes</span>
                      <span className="text-xs text-muted-foreground">
                        Clone the whiteboard notes alongside the content
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeWhiteboards}
                      onClick={() => setIncludeWhiteboards(v => !v)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
                        ${includeWhiteboards ? "bg-primary" : "bg-input"}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transform transition-transform
                          ${includeWhiteboards ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                )}

                {/* Error message */}
                {result && !result.success && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    {ERROR_MESSAGES[result.error_code ?? "UNKNOWN"]}
                  </p>
                )}

                <Button onClick={handleClone} disabled={isCloning} className="w-full">
                  {isCloning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cloning…
                    </>
                  ) : (
                    "Clone to my account"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Upgrade to Pro to access the library and clone courses and roadmaps."
      />
    </>
  )
}