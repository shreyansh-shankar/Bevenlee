"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { mockCourses } from "@/lib/course/mock-data";

export default function DashboardClient() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <DashboardHeader userId={userId!} />
      <CourseGrid courses={mockCourses} />
    </div>
  );
}
