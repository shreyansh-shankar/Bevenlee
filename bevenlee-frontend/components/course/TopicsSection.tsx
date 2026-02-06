"use client";

import { Topic } from "@/lib/api/course";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";

interface Props {
  topics: Topic[];
  onChange: (topics: Topic[]) => void;
}

export function TopicsSection({ topics, onChange }: Props) {
  const updateTopic = (
    topicId: string,
    patch: Partial<Topic>
  ) => {
    onChange(
      topics.map((t) =>
        t.topic_id === topicId ? { ...t, ...patch } : t
      )
    );
  };

  return (
    <CourseSection
      title="Topics"
      description="Course syllabus structure"
    >
      {topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No topics added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map((topic) => (
            <div
              key={topic.topic_id}
              className="rounded-lg border p-4 flex flex-col gap-1"
            >
              <EditableField
                value={topic.title}
                onChange={(v) =>
                  updateTopic(topic.topic_id, { title: v })
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
                {topic.subtopics.length} subtopics
              </p>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
