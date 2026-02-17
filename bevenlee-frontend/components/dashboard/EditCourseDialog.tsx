"use client"

import { useState } from "react"
import { Course, updateCourseMetadata } from "@/lib/api/course"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  course: Course
  onClose: () => void
  onSaved: () => void
}

export function EditCourseDialog({
  course,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState(course.title)
  const [purpose, setPurpose] = useState(course.purpose || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return

    try {
      setSaving(true)

      await updateCourseMetadata(course.course_id, {
        title,
        purpose,
      })

      onSaved()
    } catch (err) {
      console.error(err)
      alert("Failed to update")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            value={title}
            disabled={saving}
            onChange={e => setTitle(e.target.value)}
          />

          <Input
            value={purpose}
            disabled={saving}
            onChange={e => setPurpose(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
