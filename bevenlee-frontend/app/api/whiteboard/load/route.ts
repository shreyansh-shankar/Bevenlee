export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchUserPlan } from "@/lib/backend/plan"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("documentId")

    if (!documentId) {
      return NextResponse.json(
        { error: "Missing documentId" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 🔐 Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 🧠 Check plan
    const planData = await fetchUserPlan(user.id)
    const isFreePlan = planData.plan.id === 0

    if (isFreePlan) {
      return NextResponse.json(
        {
          error: "PLAN_UPGRADE_REQUIRED",
          message: "Whiteboard loading is available on Pro plan.",
        },
        { status: 403 }
      )
    }

    // 📦 Load file
    const { data, error } = await supabase.storage
      .from("whiteboards")
      .download(`whiteboard-${documentId}.json`)

    if (error || !data) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    const text = await data.text()
    const snapshot = JSON.parse(text)

    return NextResponse.json(snapshot)

  } catch (err) {
    console.error("Error loading whiteboard:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}