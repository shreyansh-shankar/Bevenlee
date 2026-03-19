// app/api/library/[itemId]/clone/route.ts
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
    const body = await req.json()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/library/${itemId}/clone`,
      {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify(body),
      }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Failed to clone item" }, { status: 500 })
  }
}