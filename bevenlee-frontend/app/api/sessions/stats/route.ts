import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const topicId = searchParams.get("topicId")

    if (!topicId) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 })
    }

    const token = await getAuthTokenServer()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/stats?topic_id=${topicId}&user_id=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error fetching session stats:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}