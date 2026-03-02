import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/roadmap/${token}`,
      { cache: "no-store" }
    )
    if (!res.ok) {
      return NextResponse.json(
        { error: res.status === 404 ? "Not found" : "Failed to fetch preview" },
        { status: res.status }
      )
    }
    return NextResponse.json(await res.json())
  } catch (err) {
    console.error("Error fetching roadmap share preview:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}