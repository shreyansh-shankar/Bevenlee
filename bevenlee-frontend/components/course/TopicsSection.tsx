"use client";

import { v4 as uuid } from "uuid";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

import { useCourseEditor } from "./editor/CourseEditorContext";
import { DraftTopic } from "@/lib/course/draft";

export function TopicsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const topics = draft.topics.filter(t => !t.isDeleted);

  function updateTopic(
    id: string,
    patch: Partial<DraftTopic>
  ) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }));
    markDirty();
  }

  function addTopic() {
    setDraft(d => ({
      ...d,
      topics: [
        ...d.topics,
        {
          id: `temp_${uuid()}`,
          topic_id: null,
          title: "New Topic",
          status: "Not Started",
          position: d.topics.length + 1,
          subtopics: [],
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteTopic(id: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id
          ? t.isNew
            ? { ...t, isDeleted: true }
            : { ...t, isDeleted: true }
          : t
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Topics"
      description="Course syllabus structure"
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={addTopic}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add topic
        </Button>
      }
    >
      {topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No topics added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map(topic => (
            <div
              key={topic.id}
              className="rounded-lg border p-4 flex items-start justify-between gap-4"
            >
              <div className="flex flex-col gap-1 flex-1">
                <EditableField
                  value={topic.title}
                  onChange={(v) =>
                    updateTopic(topic.id, { title: v })
                  }
                  className="font-medium"
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={onBlur}
                    />
                  )}
                </EditableField>

                <p className="text-xs text-muted-foreground">
                  {topic.subtopics.filter(s => !s.isDeleted).length} subtopics
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteTopic(topic.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
