import { Course } from "@/types/course";
import { CourseCard } from "./CourseCard";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
