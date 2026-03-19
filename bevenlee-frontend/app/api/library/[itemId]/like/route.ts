// app/api/library/[itemId]/like/route.ts
import { getAuthTokenServer } from "@/lib/auth/getAuthToken.server"
import { NextRequest, NextResponse } from "next/server"

async function authHeaders() {
  const token = await getAuthTokenServer()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params
    const userId = req.nextUrl.searchParams.get("user_id") ?? ""

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/library/${itemId}/like?user_id=${userId}`,
      {
        method: "POST",
        headers: await authHeaders(),
      }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}