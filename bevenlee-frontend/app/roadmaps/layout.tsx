import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getRoadmapsByUser } from "@/lib/api/roadmap"
import { RoadmapsProvider } from "@/components/roadmaps/RoadmapsProvider"
import { Navbar } from "@/components/Navbar"
import { fetchUserPlan } from "@/lib/backend/plan"

interface Props {
  children: React.ReactNode
}

async function LayoutContent({ children }: Props) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/auth/login")

  const planData = await fetchUserPlan(user.id)
  if (planData.plan.id < 1) redirect("/upgrade")

  const roadmaps = await getRoadmapsByUser(user.id, session.access_token)

  return (
    <RoadmapsProvider initialRoadmaps={roadmaps} userId={user.id}>
      {children}
    </RoadmapsProvider>
  )
}

export default function RoadmapsLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="p-6 text-muted-foreground">Loading roadmaps...</div>}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </div>
    </div>
  )
}