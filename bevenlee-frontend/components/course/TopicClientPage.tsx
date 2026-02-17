"use client";

import { useCourseEditor } from "@/components/course/editor/CourseEditorContext";

interface Props {
  topicId: string;
}

export function TopicClientPage({ topicId }: Props) {
  const { draft } = useCourseEditor();

  // find topic
  const topic = draft.topics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="p-6 text-muted-foreground">
        Topic not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{topic.title}</h1>

      {topic.title ? (
        <p className="text-muted-foreground whitespace-pre-wrap">
          {topic.status}
        </p>
      ) : (
        <p className="text-muted-foreground">
          No content yet.
        </p>
      )}
    </div>
  );
}
