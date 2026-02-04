export type CourseStatus =
  | "active"
  | "planned"
  | "paused"
  | "completed";

export interface Course {
  id: string;
  name: string;
  status: CourseStatus;
  topicsCompleted: number;
  totalTopics: number;
  assignmentsCompleted: number;
  totalAssignments: number;
}
