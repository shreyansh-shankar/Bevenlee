"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { getCoursesByUser, Course } from "@/lib/api/course";

export default function DashboardClient() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // 🔁 reusable fetch
  const fetchCourses = useCallback(async (uid: string) => {
    setCoursesLoading(true);
    try {
      const data = await getCoursesByUser(uid);
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
      fetchCourses(data.user.id);
    };

    getUser();
  }, [fetchCourses, router]);

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <DashboardHeader
        userId={userId!}
        onCourseCreated={() => fetchCourses(userId!)}
      />

      {coursesLoading ? (
        <p className="text-muted-foreground">Loading courses...</p>
      ) : (
        <CourseGrid courses={courses} />
      )}
    </div>
  );
}
