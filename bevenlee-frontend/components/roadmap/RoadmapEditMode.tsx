"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { GripVertical, X, Plus, Search, BookOpen } from "lucide-react"
import { useRoadmapEditor } from "./RoadmapEditorContext"
import { Course } from "@/lib/api/course"
import { AddCourseModal } from "@/components/dashboard/AddCourseModal"
import { Input } from "@/components/ui/input"

// ─────────────────────────────────────────────
// Existing course picker
// ─────────────────────────────────────────────

function CoursePicker({ onClose }: { onClose: () => void }) {
  const { userCourses, courses, addExistingCourse } = useRoadmapEditor()
  const [search, setSearch] = useState("")

  const alreadyAdded = new Set(courses.map(c => c.course_id))
  const filtered = userCourses.filter(
    c =>
      !alreadyAdded.has(c.course_id) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="rounded-xl border bg-card shadow-sm flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Add existing course</p>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted/20">
          <X size={15} />
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="pl-8 h-8 text-sm"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {search ? "No courses match your search" : "All your courses are already added"}
          </p>
        ) : (
          filtered.map(course => (
            <button
              key={course.course_id}
              onClick={() => { addExistingCourse(course); onClose() }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition text-left"
            >
              <BookOpen size={14} className="text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{course.title}</p>
                <p className="text-xs text-muted-foreground">{course.type}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Edit mode root
// ─────────────────────────────────────────────

export function RoadmapEditMode() {
  const {
    title,
    description,
    courses,
    setCourses,
    setTitle,
    setDescription,
    removeCourse,
    addNewCourse,
    userId,
  } = useRoadmapEditor()

  const [showPicker, setShowPicker] = useState(false)
  const [showNewCourse, setShowNewCourse] = useState(false)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const reordered = Array.from(courses)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setCourses(reordered)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Roadmap meta fields */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Roadmap name
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={description ?? ""}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="What is this roadmap about?"
            className="rounded-lg border border-border px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Course list */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Courses · {courses.length}
        </p>

        {courses.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="roadmap-courses">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-2"
                >
                  {courses.map((course, index) => (
                    <Draggable
                      key={course.course_id}
                      draggableId={course.course_id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-1 ring-primary/20" : ""
                          }`}
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical size={16} />
                          </div>

                          {/* Course info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.type}</p>
                          </div>

                          {/* Progress */}
                          {course.total_topics > 0 && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {course.completed_topics}/{course.total_topics} topics
                            </span>
                          )}

                          {/* Remove */}
                          <button
                            onClick={() => removeCourse(course.course_id)}
                            className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Picker */}
        {showPicker && (
          <CoursePicker onClose={() => setShowPicker(false)} />
        )}

        {/* Add buttons */}
        {!showPicker && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setShowPicker(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              <Plus size={15} />
              Add existing course
            </button>
            <button
              onClick={() => setShowNewCourse(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              <Plus size={15} />
              Create new course
            </button>
          </div>
        )}
      </div>

      {/* AddCourseModal — does not reload the page */}
      <AddCourseModal
        isOpen={showNewCourse}
        onClose={() => setShowNewCourse(false)}
        userId={userId}
        onCreated={(newCourse: Course) => {
          addNewCourse(newCourse)
          setShowNewCourse(false)
        }}
      />
    </div>
  )
}