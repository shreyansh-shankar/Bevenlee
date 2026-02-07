import { v4 as uuid } from "uuid";
import { CourseDetailResponse } from "../api/course";

export type ID = string;
export type TempID = `temp_${string}`;
export type EntityID = ID | TempID;

export interface DraftSubtopic {
  id: EntityID;              // UI identity (temp or real)
  subtopic_id: string | null // backend ID
  topic_id: EntityID;        // parent reference (draft-safe)

  title: string;
  is_completed: boolean;
  position: number;

  // UI-only
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface DraftTopic {
  id: EntityID;
  topic_id: string | null;

  title: string;
  status: string;
  position: number;

  subtopics: DraftSubtopic[];

  // UI-only
  isExpanded?: boolean;
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface DraftResource {
  id: EntityID;
  resource_id: string | null;

  course_id: string;
  topic_id: EntityID | null;

  title: string;
  url: string;

  isNew?: boolean;
  isDeleted?: boolean;
}

export interface DraftProject {
  id: EntityID;
  project_id: string | null;

  title: string;
  status: string;
  description: string | null;

  isNew?: boolean;
  isDeleted?: boolean;
}

export interface DraftAssignment {
  id: EntityID;
  assignment_id: string | null;

  title: string;
  status: string;
  description: string | null;

  isNew?: boolean;
  isDeleted?: boolean;
}

export interface DraftCourse {
  course_id: string;

  title: string;
  purpose?: string | null;
  type: string;
  status: "planned" | "active" | "paused" | "completed";
  priority: "low" | "medium" | "high";

  projects_enabled: boolean;
  assignments_enabled: boolean;

  topics: DraftTopic[];
  resources: DraftResource[];
  projects: DraftProject[];
  assignments: DraftAssignment[];

  // editor meta
  isDirty: boolean;
  lastSavedAt?: string;
}


export function hydrateDraftCourse(
  data: CourseDetailResponse
): DraftCourse {
  return {
    course_id: data.course.course_id,
    title: data.course.title,
    purpose: data.course.purpose,
    type: data.course.type,
    status: data.course.status,
    priority: data.course.priority,
    projects_enabled: data.course.projects_enabled,
    assignments_enabled: data.course.assignments_enabled,

    topics: data.topics.map(t => ({
      id: t.topic_id ?? `temp_${uuid()}`,
      topic_id: t.topic_id,
      title: t.title,
      status: t.status,
      position: t.position,
      subtopics: t.subtopics.map(s => ({
        id: s.subtopic_id ?? `temp_${uuid()}`,
        subtopic_id: s.subtopic_id,
        topic_id: t.topic_id!,
        title: s.title,
        is_completed: s.is_completed,
        position: s.position,
      })),
    })),

    resources: data.resources.map(r => ({
      id: r.resource_id ?? `temp_${uuid()}`,
      resource_id: r.resource_id,

      course_id: data.course.course_id, // ✅ enforce non-null
      topic_id: r.topic_id ?? null,

      title: r.title,
      url: r.url,

      isNew: false,
      isDeleted: false,
    })),

    projects: data.projects.map(p => ({
      id: p.project_id ?? `temp_${uuid()}`,
      project_id: p.project_id,

      title: p.title,
      status: p.status,
      description: p.description,

      isNew: false,
      isDeleted: false,
    })),

    assignments: data.assignments.map(a => ({
      id: a.assignment_id ?? `temp_${uuid()}`,
      assignment_id: a.assignment_id,

      title: a.title,
      status: a.status,
      description: a.description,

      isNew: false,
      isDeleted: false,
    })),

    isDirty: false,
  };
}
