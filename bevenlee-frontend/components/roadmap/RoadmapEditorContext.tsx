"use client"

import { createContext, useContext } from "react"
import { RoadmapDetail, RoadmapCourse } from "@/lib/api/roadmap"
import { Course } from "@/lib/api/course"

interface RoadmapEditorContextValue {
  // data
  roadmapId: string
  title: string
  description: string | null
  courses: RoadmapCourse[]
  userCourses: Course[]       // all courses the user owns — for the picker
  userId: string

  // edit state
  isDirty: boolean
  isSaving: boolean
  mode: "view" | "edit"

  // setters
  setTitle: (title: string) => void
  setDescription: (desc: string) => void
  setCourses: (courses: RoadmapCourse[]) => void
  setMode: (mode: "view" | "edit") => void

  // actions
  addExistingCourse: (course: Course) => void
  addNewCourse: (course: Course) => void
  removeCourse: (courseId: string) => void
  save: () => Promise<void>
}

export const RoadmapEditorContext = createContext<RoadmapEditorContextValue | null>(null)

export function useRoadmapEditor() {
  const ctx = useContext(RoadmapEditorContext)
  if (!ctx) throw new Error("useRoadmapEditor must be used inside RoadmapEditorProvider")
  return ctx
}