import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Course } from "@/types/course";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  course: Course;
}

export function CourseCard({ course }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-lg leading-tight">
          {course.name}
        </h2>
        <StatusBadge status={course.status} />
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          Topics completed:{" "}
          <span className="font-medium text-foreground">
            {course.topicsCompleted}/{course.totalTopics}
          </span>
        </p>
        <p>
          Assignments / Projects:{" "}
          <span className="font-medium text-foreground">
            {course.assignmentsCompleted}/{course.totalAssignments}
          </span>
        </p>
      </div>

      <div className="mt-auto flex justify-end">
        <Link
          href={`/dashboard/course/${course.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
        >
          Open course
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
