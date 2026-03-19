// app/api/library/route.ts
import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"
import { NextRequest, NextResponse } from "next/server"

async function authHeaders() {
  const token = await getAuthTokenServer()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// GET /api/library?user_id=...&item_type=...&liked_only=...&page=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const query = new URLSearchParams({
      user_id: searchParams.get("user_id") ?? "",
      item_type: searchParams.get("item_type") ?? "all",
      liked_only: searchParams.get("liked_only") ?? "false",
      page: searchParams.get("page") ?? "1",
    })

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/library?${query}`,
      { headers: await authHeaders() }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 })
  }
}

// POST /api/library  — add item to library
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/library`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ error: "Failed to add to library" }, { status: 500 })
  }
}