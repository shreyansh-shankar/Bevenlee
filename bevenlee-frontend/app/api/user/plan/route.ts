export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchUserPlan } from "@/lib/backend/plan"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const planData = await fetchUserPlan(user.id)
    return NextResponse.json(planData)
  } catch {
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 })
  }
}