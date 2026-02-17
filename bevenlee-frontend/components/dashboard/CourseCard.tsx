"use client"

import Link from "next/link"
import { ArrowRight, MoreVertical, Pencil, Trash } from "lucide-react"
import { Course } from "@/lib/api/course"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { deleteCourse } from "@/lib/api/course"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
  course: Course
  onEdit?: (course: Course) => void
  onDeleted?: (courseId: string) => void
}

export function CourseCard({ course, onEdit, onDeleted }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (deleting) return

    try {
      setDeleting(true)
      await deleteCourse(course.course_id)
      setOpen(false)

      onDeleted?.(course.course_id)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 hover:shadow-sm transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-lg leading-tight">
          {course.title}
        </h2>

        <div className="flex items-center gap-2">
          <StatusBadge status={course.status} />

          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-md hover:bg-muted">
              <MoreVertical size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (onEdit) onEdit(course)
                  else console.warn("onEdit not provided")
                }}
              >
                <Pencil size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>

              {/* Delete with modern confirm */}
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setOpen(true)
                    }}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete course?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently
                      delete this course and its progress.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Purpose */}
      {course.purpose && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.purpose}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-md border px-2 py-0.5 bg-muted/40">
          {course.type}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto flex justify-end">
        <Link
          href={`/course/${course.course_id}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
        >
          Open course
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
