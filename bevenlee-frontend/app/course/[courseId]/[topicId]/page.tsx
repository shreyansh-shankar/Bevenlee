"use client"

import { useCourseEditor } from "@/components/course/editor/CourseEditorContext"
import { v4 as uuid } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TopicsClientPage() {
  const { draft, setDraft, markDirty } = useCourseEditor()

  const visibleTopics = draft.topics.filter(t => !t.isDeleted)

  function addTopic() {
    setDraft(d => ({
      ...d,
      topics: [
        ...d.topics,
        {
          id: `temp_${uuid()}`,
          topic_id: null,
          title: "New Topic",
          status: "pending",
          position: d.topics.length,
          subtopics: [],
          isNew: true,
        },
      ],
    }))
    markDirty()
  }

  function updateTopicTitle(id: string, title: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id ? { ...t, title } : t
      ),
    }))
    markDirty()
  }

  function deleteTopic(id: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id ? { ...t, isDeleted: true } : t
      ),
    }))
    markDirty()
  }

  function addSubtopic(topicId: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t => {
        if (t.id !== topicId) return t

        return {
          ...t,
          subtopics: [
            ...t.subtopics,
            {
              id: `temp_${uuid()}`,
              subtopic_id: null,
              topic_id: topicId,
              title: "New Subtopic",
              is_completed: false,
              position: t.subtopics.length,
              isNew: true,
            },
          ],
        }
      }),
    }))
    markDirty()
  }

  function toggleSubtopic(topicId: string, subId: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t => {
        if (t.id !== topicId) return t

        return {
          ...t,
          subtopics: t.subtopics.map(s =>
            s.id === subId
              ? { ...s, is_completed: !s.is_completed }
              : s
          ),
        }
      }),
    }))
    markDirty()
  }

  function deleteSubtopic(topicId: string, subId: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t => {
        if (t.id !== topicId) return t

        return {
          ...t,
          subtopics: t.subtopics.map(s =>
            s.id === subId ? { ...s, isDeleted: true } : s
          ),
        }
      }),
    }))
    markDirty()
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Topics</h2>
        <Button onClick={addTopic}>Add Topic</Button>
      </div>

      {visibleTopics.map(topic => (
        <div
          key={topic.id}
          className="border rounded-xl p-4 space-y-3"
        >
          <div className="flex gap-2">
            <Input
              value={topic.title}
              onChange={e =>
                updateTopicTitle(topic.id, e.target.value)
              }
            />
            <Button
              variant="destructive"
              onClick={() => deleteTopic(topic.id)}
            >
              Delete
            </Button>
          </div>

          <div className="pl-4 space-y-2">
            {topic.subtopics
              .filter(s => !s.isDeleted)
              .map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={sub.is_completed}
                    onChange={() =>
                      toggleSubtopic(topic.id, sub.id)
                    }
                  />

                  <span
                    className={
                      sub.is_completed
                        ? "line-through text-muted-foreground"
                        : ""
                    }
                  >
                    {sub.title}
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      deleteSubtopic(topic.id, sub.id)
                    }
                  >
                    delete
                  </Button>
                </div>
              ))}

            <Button
              size="sm"
              variant="outline"
              onClick={() => addSubtopic(topic.id)}
            >
              Add Subtopic
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
