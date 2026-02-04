import { CourseStatus } from "@/types/course";
import { statusStyles } from "@/lib/styles/statusStyles";

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
