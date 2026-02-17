import { v4 as uuid } from "uuid"

export function updateTopicTitle(draft: any, topicId: string, title: string) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) =>
      t.id === topicId ? { ...t, title } : t
    ),
  }
}

export function deleteTopic(draft: any, topicId: string) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) =>
      t.id === topicId ? { ...t, isDeleted: true } : t
    ),
  }
}

export function addSubtopic(draft: any, topicId: string) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) => {
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
  }
}

export function toggleSubtopic(draft: any, topicId: string, subId: string) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) => {
      if (t.id !== topicId) return t

      return {
        ...t,
        subtopics: t.subtopics.map((s: any) =>
          s.id === subId ? { ...s, is_completed: !s.is_completed } : s
        ),
      }
    }),
  }
}

export function updateSubtopicTitle(
  draft: any,
  topicId: string,
  subId: string,
  title: string
) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) => {
      if (t.id !== topicId) return t

      return {
        ...t,
        subtopics: t.subtopics.map((s: any) =>
          s.id === subId ? { ...s, title } : s
        ),
      }
    }),
  }
}

export function deleteSubtopic(draft: any, topicId: string, subId: string) {
  return {
    ...draft,
    topics: draft.topics.map((t: any) => {
      if (t.id !== topicId) return t

      return {
        ...t,
        subtopics: t.subtopics.map((s: any) =>
          s.id === subId ? { ...s, isDeleted: true } : s
        ),
      }
    }),
  }
}
