import { Suspense } from "react";
import { getCourseDetail } from "@/lib/api/course";
import { CourseClientPage } from "@/components/course/CourseClientPage";
import { CourseLayout } from "@/components/course/CourseLayout";
import { Navbar } from "@/components/Navbar";
import { CourseEditorProvider } from "@/components/course/editor/CourseEditorProvider";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

function CourseLoading() {
    return (
        <CourseLayout>
            <div className="rounded-xl border bg-card p-6 h-40 animate-pulse" />
            <div className="rounded-xl border bg-card p-6 h-32 animate-pulse" />
        </CourseLayout>
    );
}

async function CourseContent({ params }: { params: PageProps["params"] }) {
    const { courseId } = await params;
    const data = await getCourseDetail(courseId);

    return (
    <CourseEditorProvider initialData={data}>
      <CourseClientPage />
    </CourseEditorProvider>
  );
}

export default function CoursePage({ params }: PageProps) {
    return (
        <>
            {/* Global navbar */}
            <Navbar />
            <Suspense fallback={<CourseLoading />}>
                <CourseContent params={params} />
            </Suspense>
        </>
    );
}
