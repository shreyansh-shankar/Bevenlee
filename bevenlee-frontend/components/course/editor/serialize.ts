// components/course/editor/serialize.ts
import {
  DraftCourse,
  DraftTopic,
  DraftSubtopic,
  DraftProject,
  DraftAssignment,
  DraftResource,
} from "@/lib/course/draft";

import {
  Topic,
  Subtopic,
  Project,
  Assignment,
  Resource,
} from "@/lib/api/course";


export function serializeDraftCourse(draft: DraftCourse) {
  return {
    course_id: draft.course_id,

    course: {
      title: draft.title,
      type: draft.type,
      status: draft.status,
      priority: draft.priority,
      purpose: draft.purpose ?? null,
      projects_enabled: draft.projects_enabled,
      assignments_enabled: draft.assignments_enabled,
    },

    topics: serializeTopics(draft.topics),
    resources: serializeResources(draft),
    projects: serializeProjects(draft),
    assignments: serializeAssignments(draft),
  };
}

function serializeTopics(topics: DraftTopic[]): Topic[] {
  return topics
    .filter(t => !t.isDeleted)
    .map(t => ({
      topic_id: t.topic_id,
      title: t.title,
      status: t.status,
      position: t.position,

      subtopics: t.subtopics
        .filter(s => !s.isDeleted)
        .map(s => ({
          subtopic_id: s.subtopic_id,
          topic_id: t.topic_id!, // backend-safe
          title: s.title,
          is_completed: s.is_completed,
          position: s.position,
        })),
    }));
}

function serializeProjects(draft: DraftCourse): Project[] {
  return draft.projects
    .filter(p => !p.isDeleted)
    .map(p => ({
      project_id: p.project_id,
      course_id: draft.course_id, // ✅ REQUIRED by backend
      title: p.title,
      status: p.status,
      description: p.description ?? null,
    }));
}

function serializeAssignments(draft: DraftCourse): Assignment[] {
  return draft.assignments
    .filter(a => !a.isDeleted)
    .map(a => ({
      assignment_id: a.assignment_id,
      course_id: draft.course_id,
      title: a.title,
      status: a.status,
      description: a.description ?? null,
    }));
}

function serializeResources(draft: DraftCourse): Resource[] {
  return draft.resources
    .filter(r => !r.isDeleted)
    .map(r => ({
      resource_id: r.resource_id,
      course_id: draft.course_id,
      topic_id:
        typeof r.topic_id === "string" && !r.topic_id.startsWith("temp_")
          ? r.topic_id
          : null,
      title: r.title,
      url: r.url,
    }));
}
