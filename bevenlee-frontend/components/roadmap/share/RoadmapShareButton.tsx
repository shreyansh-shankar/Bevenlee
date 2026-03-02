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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, Loader2 } from "lucide-react"
import { createRoadmapShareLink, ShareExpiry, RoadmapShareLink } from "@/lib/course/roadmap-share"
import { toast } from "@/hooks/use-toast"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

interface Props {
  roadmapId: string
}

export function RoadmapShareButton({ roadmapId }: Props) {
  const [open, setOpen] = useState(false)
  const [expiry, setExpiry] = useState<ShareExpiry>("never")
  const [whiteboards, setWhiteboards] = useState(false)
  const [shareLink, setShareLink] = useState<RoadmapShareLink | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function handleCreate() {
    setIsCreating(true)
    try {
      const link = await createRoadmapShareLink(roadmapId, expiry, whiteboards)
      setShareLink(link)
    } catch (err: any) {
      toast({ title: "Failed to create link", description: err.message, variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  async function handleCopy() {
    if (!shareLink) return
    await navigator.clipboard.writeText(shareLink.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Link copied!" })
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setShareLink(null)
      setExpiry("never")
      setWhiteboards(false)
      setCopied(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          setOpen(true)
        }}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this roadmap</DialogTitle>
            <DialogDescription>
              Anyone with the link can preview and add this roadmap — including all its courses — to their account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            {!shareLink ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Link expiry</label>
                  <Select value={expiry} onValueChange={(v) => setExpiry(v as ShareExpiry)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="7d">Expires in 7 days</SelectItem>
                      <SelectItem value="30d">Expires in 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-sm font-medium">Include whiteboards</label>
                    <span className="text-xs text-muted-foreground">
                      Recipients receive a copy of your whiteboard notes
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={whiteboards}
                    onClick={() => setWhiteboards((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
                      ${whiteboards ? "bg-primary" : "bg-input"}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transform transition-transform
                      ${whiteboards ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating link…</>
                  ) : "Generate share link"}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Input readOnly value={shareLink.url} className="text-sm font-mono" />
                  <Button size="icon" variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                {shareLink.expires_at && (
                  <p className="text-xs text-muted-foreground">
                    Expires {new Date(shareLink.expires_at).toLocaleDateString()}
                  </p>
                )}

                <Button variant="outline" size="sm" onClick={() => setShareLink(null)}>
                  Generate a new link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="Roadmap sharing is a Pro feature. Upgrade to share your roadmaps with others."
      />
    </>
  )
}