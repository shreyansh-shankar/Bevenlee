"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { RoadmapEditorContext } from "./RoadmapEditorContext"
import { RoadmapDetail, RoadmapCourse, saveRoadmap } from "@/lib/api/roadmap"
import { Course } from "@/lib/api/course"

export function RoadmapEditorProvider({
  initialDetail,
  userCourses,
  userId,
  children,
}: {
  initialDetail: RoadmapDetail
  userCourses: Course[]
  userId: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "edit" ? "edit" : "view"

  const [title, setTitleState] = useState(initialDetail.roadmap.title)
  const [description, setDescriptionState] = useState<string | null>(initialDetail.roadmap.description)
  const [courses, setCoursesState] = useState<RoadmapCourse[]>(initialDetail.courses)
  const [mode, setMode] = useState<"view" | "edit">(initialMode)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const roadmapId = initialDetail.roadmap.roadmap_id

  function markDirty() { setIsDirty(true) }

  function setTitle(t: string) { setTitleState(t); markDirty() }
  function setDescription(d: string) { setDescriptionState(d); markDirty() }
  function setCourses(c: RoadmapCourse[]) { setCoursesState(c); markDirty() }

  // Add a course the user already owns — convert Course → RoadmapCourse shape
  function addExistingCourse(course: Course) {
    const already = courses.some(c => c.course_id === course.course_id)
    if (already) return

    const newCourse: RoadmapCourse = {
      course_id: course.course_id,
      title: course.title,
      type: course.type,
      status: course.status,
      priority: course.priority,
      purpose: course.purpose ?? null,
      projects_enabled: false,
      assignments_enabled: false,
      topics: [],
      total_topics: 0,
      completed_topics: 0,
    }

    setCourses([...courses, newCourse])
  }

  // Add a brand-new course (just created via AddCourseModal) — same conversion
  function addNewCourse(course: Course) {
    addExistingCourse(course)
  }

  function removeCourse(courseId: string) {
    setCourses(courses.filter(c => c.course_id !== courseId))
  }

  async function save() {
    setIsSaving(true)
    try {
      await saveRoadmap(roadmapId, {
        title,
        description,
        course_ids: courses.map(c => c.course_id),
      })
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <RoadmapEditorContext.Provider
      value={{
        roadmapId,
        title,
        description,
        courses,
        userCourses,
        userId,
        isDirty,
        isSaving,
        mode,
        setTitle,
        setDescription,
        setCourses,
        setMode,
        addExistingCourse,
        addNewCourse,
        removeCourse,
        save,
      }}
    >
      {children}
    </RoadmapEditorContext.Provider>
  )
}