"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { EditCourseDialog } from "./EditCourseDialog";
import { getCoursesByUser, Course } from "@/lib/api/course";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default function DashboardClient() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  /**
   * Fetch courses for user
   */
  const fetchCourses = useCallback(async (uid: string) => {
    setLoadingCourses(true);
    try {
      const data = await getCoursesByUser(uid);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  /**
   * Remove deleted course from UI instantly
   */
  const handleDeleted = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.course_id !== courseId));
  };

  /**
   * Load authenticated user
   */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (!isMounted) return;

      setUserId(user.id);
      setLoadingUser(false);
      fetchCourses(user.id);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses, router]);

  if (loadingUser) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <DashboardHeader
        userId={userId!}
        onCourseCreated={() => fetchCourses(userId!)}
      />

      {loadingCourses ? (
        <p className="text-muted-foreground">Loading courses...</p>
      ) : (
        <CourseGrid
          courses={courses}
          onEdit={setEditingCourse}
          onDeleted={handleDeleted}
        />
      )}

      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSaved={() => {
            setEditingCourse(null);
            fetchCourses(userId!);
          }}
        />
      )}
    </div>
  );
}