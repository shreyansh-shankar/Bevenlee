import { Course } from "@/lib/api/course";
import { CourseCard } from "./CourseCard";

interface Props {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDeleted: (courseId: string) => void;
}

export function CourseGrid({ courses, onEdit, onDeleted }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.course_id}
          course={course}
          onEdit={onEdit}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}