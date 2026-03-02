import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/roadmap/${token}/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      const detail = data.detail ?? data
      return NextResponse.json(
        {
          error: detail.error ?? "Failed to accept share",
          error_code: detail.error_code ?? "UNKNOWN",
        },
        { status: res.status }
      )
    }

    return NextResponse.json({ roadmap_id: data.roadmap_id })
  } catch (err) {
    console.error("Error accepting roadmap share:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}