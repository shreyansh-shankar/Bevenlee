import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Course } from "@/lib/api/course";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  course: Course;
}

export function CourseCard({ course }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 hover:shadow-sm transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-lg leading-tight">
          {course.title}
        </h2>

        {/* Status position unchanged */}
        <StatusBadge status={course.status} />
      </div>

      {/* Purpose */}
      {course.purpose && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.purpose}
        </p>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-md border px-2 py-0.5 bg-muted/40">
          {course.type}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto flex justify-end">
        <Link
          href={`/dashboard/course/${course.course_id}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition"
        >
          Open course
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
