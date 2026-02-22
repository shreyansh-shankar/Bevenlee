import { createCourse } from "@/lib/api/course";

export type CreateCourseInput = {
  userId: string;
  title: string;
  purpose?: string;
  type: string;
  status: "planned" | "active" | "paused" | "completed";
  priority: "low" | "medium" | "high";
  projectsEnabled: boolean;
  assignmentsEnabled: boolean;
};

export async function createCourseAction(data: CreateCourseInput) {
  return createCourse({
    user_id: data.userId,
    title: data.title,
    purpose: data.purpose,
    type: data.type,
    status: data.status,
    priority: data.priority,
    projects_enabled: data.projectsEnabled,
    assignments_enabled: data.assignmentsEnabled,
  });
}