import { Suspense } from "react"
import { getCourseDetail } from "@/lib/api/course"
import { CourseEditorProvider } from "@/components/course/editor/CourseEditorProvider"
import { Navbar } from "@/components/Navbar"

interface Props {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}

async function LayoutContent({
  children,
  params,
}: Props) {
  const { courseId } = await params
  const data = await getCourseDetail(courseId)

  return (
    <CourseEditorProvider initialData={data}>
      {children}
    </CourseEditorProvider>
  )
}

export default function CourseLayoutWrapper(props: Props) {
  return (
    <>
      <Navbar />

      <Suspense fallback={<div className="p-6">Loading course...</div>}>
        <LayoutContent {...props} />
      </Suspense>
    </>
  )
}
