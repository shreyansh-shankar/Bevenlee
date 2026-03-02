import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { course_id, expiry, whiteboards = false } = body

    if (!course_id || !expiry) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const token = await getAuthTokenServer()

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        course_id,
        expiry,
        whiteboards,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      // Surface plan errors to client
      if (data.error_code === "PLAN_UPGRADE_REQUIRED") {
        return NextResponse.json(data, { status: 403 })
      }
      return NextResponse.json({ error: data.error ?? "Failed to create link" }, { status: 500 })
    }

    const data = await res.json()

    // Build the full shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    return NextResponse.json({
      token: data.token,
      url: `${baseUrl}/share/${data.token}`,
      expires_at: data.expires_at,
      whiteboards: data.whiteboards,
    })
  } catch (err) {
    console.error("Error creating share link:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}