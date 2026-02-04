import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { mockCourses } from "@/lib/course/mock-data";

export default async function ProtectedPage() {

  return (
    <div className="flex flex-col gap-10">
      <DashboardHeader />
      <CourseGrid courses={mockCourses} />
    </div>
  );
}
