"use client"

import { useRouter } from "next/navigation"
import { useCourseEditor } from "@/components/course/editor/CourseEditorContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, ArrowLeft, Pencil } from "lucide-react"
import { useState, useRef } from "react"
import {
  updateTopicTitle,
  deleteTopic,
  addSubtopic,
  toggleSubtopic,
  updateSubtopicTitle,
  deleteSubtopic,
} from "@/lib/course/topicMutations"

interface Props {
  topicId: string
  courseId: string
}

export default function TopicClientPage({ topicId, courseId }: Props) {
  const router = useRouter()
  const { draft, setDraft, markDirty } = useCourseEditor()

  const [editingTopic, setEditingTopic] = useState(false)
  const [editingSubId, setEditingSubId] = useState<string | null>(null)

  const topicInputRef = useRef<HTMLInputElement>(null)
  const subInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const topic = draft.topics.find(
    t => t.id === topicId || t.topic_id === topicId
  )

  if (!topic || topic.isDeleted) {
    return (
      <p className="text-muted-foreground text-sm">
        Topic not found.
      </p>
    )
  }

  const currentTopic = topic

  function handleTitleChange(title: string) {
    setDraft(d => updateTopicTitle(d, currentTopic.id, title))
    markDirty()
  }

  function handleAddSubtopic() {
    setDraft(d => addSubtopic(d, currentTopic.id))
    markDirty()
  }

  function handleToggle(subId: string) {
    setDraft(d => toggleSubtopic(d, currentTopic.id, subId))
    markDirty()
  }

  function handleSubtopicTitle(subId: string, title: string) {
    setDraft(d =>
      updateSubtopicTitle(d, currentTopic.id, subId, title)
    )
    markDirty()
  }

  function handleDeleteSubtopic(subId: string) {
    setDraft(d => deleteSubtopic(d, currentTopic.id, subId))
    markDirty()
  }


  const visibleSubtopics = currentTopic.subtopics.filter(
    s => !s.isDeleted
  )

  return (
    <div className="px-8 py-6 space-y-6 max-w-3xl">

      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/course/${courseId}`)}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Button>

      {/* HEADER */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3 flex-1 group">
          {editingTopic ? (
            <Input
              ref={topicInputRef}
              value={currentTopic.title}
              autoFocus
              onFocus={e => e.target.select()}
              onChange={e => handleTitleChange(e.target.value)}
              onBlur={() => setEditingTopic(false)}
              onKeyDown={e => {
                if (e.key === "Enter") setEditingTopic(false)
                if (e.key === "Escape") setEditingTopic(false)
              }}
              className="text-2xl md:text-3xl font-semibold border-none px-0 focus-visible:ring-0 h-auto"
            />
          ) : (
            <h1
              className="text-2xl md:text-3xl font-semibold cursor-text"
              onClick={() => setEditingTopic(true)}
            >
              {currentTopic.title || "Untitled topic"}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditingTopic(true)}
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* SUBTOPICS */}
      <Card className="p-3">

        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Subtopics
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddSubtopic}
            className="h-7 px-2"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        {visibleSubtopics.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No subtopics yet.
          </p>
        )}

        <div className="flex flex-col">
          {visibleSubtopics.map(sub => (
            <div
              key={sub.id}
              className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/50 transition w-full"
            >
              <Checkbox
                checked={sub.is_completed}
                onCheckedChange={() => handleToggle(sub.id)}
              />

              <div className="flex-1 min-w-0">
                {editingSubId === sub.id ? (
                  <Input
                    ref={el => {
                      subInputRefs.current[sub.id] = el
                    }}
                    value={sub.title}
                    autoFocus
                    onFocus={e => e.target.select()}
                    onChange={e => handleSubtopicTitle(sub.id, e.target.value)}
                    onBlur={() => setEditingSubId(null)}
                    onKeyDown={e => {
                      if (e.key === "Enter") setEditingSubId(null)
                      if (e.key === "Escape") setEditingSubId(null)
                    }}
                    className={`border-none shadow-none px-0 focus-visible:ring-0 text-sm w-full ${sub.is_completed ? "line-through text-muted-foreground" : ""
                      }`}
                  />
                ) : (
                  <span
                    onClick={() => setEditingSubId(sub.id)}
                    className={`text-sm cursor-text block truncate ${sub.is_completed ? "line-through text-muted-foreground" : ""
                      }`}
                  >
                    {sub.title || "Untitled"}
                  </span>
                )}
              </div>

              <div className="flex items-center ml-auto opacity-0 group-hover:opacity-100 transition">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingSubId(sub.id)}
                >
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteSubtopic(sub.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>

          ))}
        </div>
      </Card>
    </div>
  )
}
