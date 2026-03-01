"use client"

import { useRoadmapEditor } from "./RoadmapEditorContext"
import { RoadmapCourse } from "@/lib/api/roadmap"
import { Map } from "lucide-react"
import Link from "next/link"

export function RoadmapViewMode() {
  const { courses } = useRoadmapEditor()

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="rounded-full bg-muted p-5">
          <Map size={26} className="text-muted-foreground" />
        </div>
        <p className="font-medium">No courses in this roadmap</p>
        <p className="text-sm text-muted-foreground">
          Switch to edit mode to add courses
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {courses.map((course, index) => {
        const isLeft = index % 2 === 0
        return (
          <CourseNode
            key={course.course_id}
            course={course}
            index={index}
            isLeft={isLeft}
            isLast={index === courses.length - 1}
          />
        )
      })}
    </div>
  )
}

function CourseNode({
  course,
  index,
  isLeft,
  isLast,
}: {
  course: RoadmapCourse
  index: number
  isLeft: boolean
  isLast: boolean
}) {
  const progress = course.total_topics > 0
    ? course.completed_topics / course.total_topics
    : 0

  const isCompleted = progress === 1 && course.total_topics > 0
  const isStarted = progress > 0 && progress < 1

  const circumference = 2 * Math.PI * 28 // radius 28
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className={`flex w-full items-center gap-4 ${isLeft ? "justify-start pl-8" : "justify-end pr-8"}`}>
      <div className={`flex flex-col items-center ${isLeft ? "" : "items-end"}`}>

        {/* Connector line from previous node */}
        {index > 0 && (
          <div className={`w-0.5 h-10 ${isCompleted ? "bg-primary" : "bg-border"} mb-1`} />
        )}

        {/* Node */}
        <Link
          href={`/course/${course.course_id}`}
          className="group flex flex-col items-center gap-3 mb-1"
        >
          {/* Circle with progress ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              {/* Background ring */}
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                strokeWidth="4"
                className="stroke-border"
              />
              {/* Progress ring */}
              {progress > 0 && (
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="stroke-primary transition-all duration-500"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              )}
            </svg>

            {/* Inner circle */}
            <div className={`
              absolute inset-2 rounded-full flex items-center justify-center text-sm font-bold
              transition-colors
              ${isCompleted
                ? "bg-primary text-primary-foreground"
                : isStarted
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }
              group-hover:bg-primary/20 group-hover:text-primary
            `}>
              {isCompleted ? "✓" : index + 1}
            </div>
          </div>

          {/* Course info */}
          <div className={`flex flex-col gap-0.5 max-w-[160px] ${isLeft ? "items-start text-left" : "items-end text-right"}`}>
            <span className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
              {course.title}
            </span>
            <span className="text-xs text-muted-foreground">{course.type}</span>
            {course.total_topics > 0 && (
              <span className="text-xs text-muted-foreground">
                {course.completed_topics}/{course.total_topics} topics
              </span>
            )}
          </div>
        </Link>

        {/* Connector to next node */}
        {!isLast && (
          <div className={`w-0.5 h-10 ${isCompleted ? "bg-primary" : "bg-border"} mt-1`} />
        )}
      </div>
    </div>
  )
}