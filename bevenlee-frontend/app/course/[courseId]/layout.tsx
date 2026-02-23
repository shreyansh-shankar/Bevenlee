import { Suspense } from "react"
import { getCourseDetail } from "@/lib/api/course"
import { CourseEditorProvider } from "@/components/course/editor/CourseEditorProvider"
import { Navbar } from "@/components/Navbar"
import { createClient } from "@/lib/supabase/server"

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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userId = user?.id ?? null

  return (
    <CourseEditorProvider initialData={data} userId={user!.id ?? null}>
      {children}
    </CourseEditorProvider>
  )
}

export default function CourseLayoutWrapper(props: Props) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="p-6">Loading course...</div>}>
          <LayoutContent {...props} />
        </Suspense>
      </div>
    </div>
  )
}