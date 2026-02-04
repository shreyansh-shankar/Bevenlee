import { CourseStatus } from "@/types/course";

export const statusStyles: Record<CourseStatus, string> = {
  active: "bg-green-500/10 text-green-600",
  planned: "bg-blue-500/10 text-blue-600",
  paused: "bg-yellow-500/10 text-yellow-600",
  completed: "bg-purple-500/10 text-purple-600",
};
