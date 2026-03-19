"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Library, Loader2, CheckCircle2 } from "lucide-react"
import { addToLibrary } from "@/lib/library/api"
import { toast } from "@/hooks/use-toast"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  courseId: string
  userId: string
  isPro: boolean
}

export function AddToLibraryButton({ courseId, userId, isPro }: Props) {
  const [open, setOpen] = useState(false)
  const [whiteboards, setWhiteboards] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setWhiteboards(false)
      setAdded(false)
    }
  }

  async function handleAdd() {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }

    setIsAdding(true)

    const result = await addToLibrary({
      userId,
      itemType: "course",
      sourceId: courseId,
      whiteboards,
    })

    setIsAdding(false)

    if (result.success) {
      setAdded(true)
      return
    }

    // Already in library — treat as soft info, not a crash
    if (result.error?.includes("already in the library")) {
      toast({
        title: "Already in library",
        description: "This course is already listed in the library.",
      })
      setOpen(false)
      return
    }

    toast({
      title: "Failed to add to library",
      description: result.error ?? "Something went wrong.",
      variant: "destructive",
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          if (!isPro) {
            setShowUpgrade(true)
            return
          }
          setOpen(true)
        }}
      >
        <Library className="w-4 h-4" />
        Add to Library
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">

          {added ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Added to library!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your course is now visible in the community library.
                </p>
              </div>
              <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add to library</DialogTitle>
                <DialogDescription>
                  Share this course with the community. Anyone on Pro or above will be able to clone it.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 pt-2">
                {/* Whiteboard toggle */}
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Allow whiteboard cloning</span>
                    <span className="text-xs text-muted-foreground">
                      Let others clone your whiteboard notes too
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={whiteboards}
                    onClick={() => setWhiteboards(v => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
                      ${whiteboards ? "bg-primary" : "bg-input"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transform transition-transform
                        ${whiteboards ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <Button onClick={handleAdd} disabled={isAdding} className="w-full">
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding…
                    </>
                  ) : (
                    "Add to library"
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
        message="Adding courses to the library is a Pro feature. Upgrade to contribute to the community."
      />
    </>
  )
}