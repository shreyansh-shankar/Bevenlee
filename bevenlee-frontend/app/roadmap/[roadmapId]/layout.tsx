import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getRoadmapDetail } from "@/lib/api/roadmap"
import { getCoursesByUser } from "@/lib/api/course"
import { RoadmapEditorProvider } from "@/components/roadmap/RoadmapEditorProvider"
import { Navbar } from "@/components/Navbar"
import { fetchUserPlan } from "@/lib/backend/plan"

interface Props {
  children: React.ReactNode
  params: Promise<{ roadmapId: string }>
}

async function LayoutContent({ children, params }: Props) {
  const { roadmapId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const planData = await fetchUserPlan(user.id)
  if (planData.plan.id < 1) redirect("/upgrade")

  const [detail, userCourses] = await Promise.all([
    getRoadmapDetail(roadmapId, session.access_token),
    getCoursesByUser(user.id, session.access_token), 
  ])

  return (
    <RoadmapEditorProvider
      initialDetail={detail}
      userCourses={userCourses}
      userId={user.id}
    >
      {children}
    </RoadmapEditorProvider>
  )
}

export default function RoadmapLayout(props: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="p-6 text-muted-foreground">Loading roadmap...</div>}>
          <LayoutContent {...props} />
        </Suspense>
      </div>
    </div>
  )
}