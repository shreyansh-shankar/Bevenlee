"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Map, ArrowRight, Trash2 } from "lucide-react"
import { useRoadmaps } from "./RoadmapsContext"
import { CreateRoadmapModal } from "./CreateRoadmapModal"
import { deleteRoadmap } from "@/lib/api/roadmap"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function RoadmapsClientPage() {
  const router = useRouter()
  const { roadmaps, removeRoadmap } = useRoadmaps()
  const [createOpen, setCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deletingId || deleting) return
    setDeleting(true)
    try {
      await deleteRoadmap(deletingId)
      removeRoadmap(deletingId)
      setDeletingId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roadmaps</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Structured learning paths to reach your goals
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
        >
          <Plus size={16} />
          New Roadmap
        </button>
      </div>

      {/* List */}
      {roadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="rounded-full bg-muted p-5">
            <Map size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No roadmaps yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first roadmap to start tracking a learning path
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
          >
            <Plus size={16} />
            New Roadmap
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roadmaps.map(roadmap => (
            <div
              key={roadmap.roadmap_id}
              className="rounded-xl border bg-card p-5 flex flex-col gap-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Map size={16} className="text-primary" />
                  </div>
                  <h2 className="font-semibold leading-tight">{roadmap.title}</h2>
                </div>
                <button
                  onClick={() => setDeletingId(roadmap.roadmap_id)}
                  className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-muted-foreground transition shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {roadmap.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {roadmap.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground">
                  {roadmap.course_ids.length} course{roadmap.course_ids.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => router.push(`/roadmap/${roadmap.roadmap_id}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition"
                >
                  Open
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateRoadmapModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete roadmap?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this roadmap. Your courses will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}