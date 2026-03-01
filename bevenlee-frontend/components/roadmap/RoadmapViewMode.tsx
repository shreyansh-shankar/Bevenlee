"use client"

import { useRoadmapEditor } from "./RoadmapEditorContext"
import { RoadmapCourse } from "@/lib/api/roadmap"
import { Map } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// ── Layout constants (all in px, SVG coordinates) ──────────────────────────
const NODE_SIZE   = 100
const ROW_GAP     = 240
const SVG_W       = 640
const LEFT_CX     = 120
const RIGHT_CX    = SVG_W - 120
const NODE_R      = NODE_SIZE / 2

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

  const totalH = (courses.length - 1) * ROW_GAP + NODE_SIZE + 40

  const cy = (i: number) => 20 + NODE_R + i * ROW_GAP
  const cx = (i: number) => i % 2 === 0 ? LEFT_CX : RIGHT_CX

  const segments: { d: string; completed: boolean }[] = []
  for (let i = 0; i < courses.length - 1; i++) {
    const x1 = cx(i), y1 = cy(i)
    const x2 = cx(i + 1), y2 = cy(i + 1)
    const startY = y1 + NODE_R
    const endY   = y2 - NODE_R
    const cp1Y = startY + (endY - startY) * 0.4
    const cp2Y = startY + (endY - startY) * 0.6
    const d = `M ${x1} ${startY} C ${x1} ${cp1Y}, ${x2} ${cp2Y}, ${x2} ${endY}`
    const fromDone = courses[i].total_topics > 0 && courses[i].completed_topics === courses[i].total_topics
    const toDone   = courses[i+1].total_topics > 0 && courses[i+1].completed_topics === courses[i+1].total_topics
    segments.push({ d, completed: fromDone && toDone })
  }

  return (
    <div className="flex justify-center w-full">
      <div className="relative" style={{ width: SVG_W, minHeight: totalH }}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width={SVG_W}
          height={totalH}
          viewBox={`0 0 ${SVG_W} ${totalH}`}
        >
          {segments.map(({ d, completed }, i) => (
            <g key={i}>
              <path d={d} fill="none" strokeWidth="2.5" strokeDasharray="8 5" strokeLinecap="round" className="stroke-border" />
              {completed && <path d={d} fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-primary" />}
            </g>
          ))}
        </svg>

        {courses.map((course, index) => {
          const isLeft  = index % 2 === 0
          const centerX = cx(index)
          const centerY = cy(index)
          return (
            <CourseNode
              key={course.course_id}
              course={course}
              index={index}
              isLeft={isLeft}
              nodeLeft={centerX - NODE_R}
              nodeTop={centerY - NODE_R}
              nodeSize={NODE_SIZE}
            />
          )
        })}
      </div>
    </div>
  )
}

function CourseNode({
  course, index, isLeft, nodeLeft, nodeTop, nodeSize,
}: {
  course: RoadmapCourse
  index: number
  isLeft: boolean
  nodeLeft: number
  nodeTop: number
  nodeSize: number
}) {
  const [hovered, setHovered] = useState(false)

  const progress      = course.total_topics > 0 ? course.completed_topics / course.total_topics : 0
  const isCompleted   = progress === 1 && course.total_topics > 0
  const isStarted     = progress > 0 && progress < 1
  const radius        = nodeSize / 2 - 4
  const circumference = 2 * Math.PI * radius
  const dashOffset    = circumference * (1 - progress)
  const topics        = course.topics ?? []

  return (
    <div className="absolute" style={{ left: nodeLeft, top: nodeTop, width: nodeSize, height: nodeSize }}>
      <Link
        href={`/course/${course.course_id}`}
        className="group block w-full h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Ring */}
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${nodeSize} ${nodeSize}`}>
          <circle cx={nodeSize/2} cy={nodeSize/2} r={radius} fill="none" strokeWidth="3.5" className="stroke-border" />
          {progress > 0 && (
            <circle
              cx={nodeSize/2} cy={nodeSize/2} r={radius}
              fill="none" strokeWidth="3.5" strokeLinecap="round"
              className="stroke-primary transition-all duration-700"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          )}
        </svg>

        {/* Inner fill */}
        <div className={`
          absolute inset-2.5 rounded-full flex items-center justify-center font-bold
          transition-all duration-300 text-base
          ${isCompleted
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : isStarted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }
          group-hover:scale-105
        `}>
          {isCompleted ? (
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      </Link>

      {/* Label */}
      <div className={`
        absolute top-1/2 -translate-y-1/2 w-[200px]
        flex flex-col gap-1 pointer-events-none
        ${isLeft ? "left-[calc(100%+14px)] items-start text-left" : "right-[calc(100%+14px)] items-end text-right"}
      `}>
        <span className={`text-base font-semibold leading-snug ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
          {course.title}
        </span>
        <span className="text-sm text-muted-foreground">{course.type}</span>
      </div>

      {/* Hover tooltip */}
      {hovered && topics.length > 0 && (
        <div className={`
          absolute z-20 top-1/2 -translate-y-1/2
          w-56 rounded-xl border bg-popover shadow-xl p-3.5
          flex flex-col gap-2
          ${isLeft ? "left-[calc(100%+175px)]" : "right-[calc(100%+175px)]"}
        `}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Topics</p>
          {topics.map((topic) => {
            const done = topic.status === "completed"
            return (
              <div key={topic.topic_id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${done ? "bg-primary" : "bg-border"}`} />
                <span className={`text-sm leading-tight ${done ? "line-through text-muted-foreground" : ""}`}>
                  {topic.title}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}