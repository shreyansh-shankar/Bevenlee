import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { topic_id, started_at, duration_minutes } = body

    if (!topic_id || !started_at || duration_minutes == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const token = await getAuthTokenServer()

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        topic_id,
        started_at,
        duration_minutes,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json({ error: data.error ?? "Failed to save" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error saving session:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}