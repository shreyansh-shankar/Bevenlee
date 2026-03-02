"use client"

import { useRoadmapEditor } from "./RoadmapEditorContext"
import { RoadmapViewMode } from "./RoadmapViewMode"
import { RoadmapEditMode } from "./RoadmapEditMode"
import { Pencil, X, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoadmapShareButton } from "./share/RoadmapShareButton"

export function RoadmapClientPage() {
  const { title, description, mode, setMode, isDirty, isSaving, save, roadmapId } = useRoadmapEditor()

  async function handleSave() {
    await save()
    setMode("view")
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {mode === "edit" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("view")}
                disabled={isSaving}
              >
                <X size={14} className="mr-1.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
              >
                {isSaving ? (
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                ) : (
                  <Save size={14} className="mr-1.5" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              <RoadmapShareButton roadmapId={roadmapId} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("edit")}
              >
                <Pencil size={14} className="mr-1.5" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {mode === "view" ? <RoadmapViewMode /> : <RoadmapEditMode />}
    </div>
  )
}