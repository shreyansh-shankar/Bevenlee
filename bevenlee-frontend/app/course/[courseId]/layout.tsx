import { Suspense } from "react"
import { getCourseDetail } from "@/lib/api/course"
import { CourseEditorProvider } from "@/components/course/editor/CourseEditorProvider"
import { Navbar } from "@/components/Navbar"
import { createClient } from "@/lib/supabase/server"
import { fetchUserPlan } from "@/lib/backend/plan"
import { redirect } from "next/navigation"

interface Props {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}

async function LayoutContent({ children, params }: Props) {
  const { courseId } = await params

  const supabase = await createClient()

  // ✅ secure — verifies with Supabase Auth server
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // getSession only used to extract the access token — safe after getUser confirms identity
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const [data, planData] = await Promise.all([
    getCourseDetail(courseId, session.access_token),
    fetchUserPlan(user.id),
  ])

  const isPro = planData.plan.id >= 1   // PRO = 1, PREMIUM = 2

  return (
    <CourseEditorProvider initialData={data} userId={user.id} isPro={isPro}>
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