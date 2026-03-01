"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { X, Map } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createRoadmap } from "@/lib/api/roadmap"
import { useRoadmaps } from "./RoadmapsContext"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoadmapModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const { userId, addRoadmap } = useRoadmaps()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setTitle("")
    setDescription("")
    setError(null)
  }

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    setError(null)

    try {
      const roadmap = await createRoadmap({
        user_id: userId,
        title: title.trim(),
        description: description.trim() || undefined,
      })

      addRoadmap(roadmap)
      reset()
      onClose()
      router.push(`/roadmap/${roadmap.roadmap_id}?mode=edit`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-sm flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Map size={18} className="text-primary" />
              </div>
              <Dialog.Title className="text-lg font-semibold">
                New Roadmap
              </Dialog.Title>
            </div>
            <button
              onClick={() => { reset(); onClose() }}
              className="p-1 rounded hover:bg-muted/20 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="Full Stack Developer Path"
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A structured path to become a full stack developer..."
              rows={3}
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleCreate}
            disabled={!title.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Roadmap →"}
          </Button>

        </Dialog.Panel>
      </div>
    </Dialog>
  )
}