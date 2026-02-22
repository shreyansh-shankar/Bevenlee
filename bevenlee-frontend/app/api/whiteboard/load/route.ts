import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("documentId")

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from("whiteboards")
      .download(`whiteboard-${documentId}.json`)

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const text = await data.text()
    const snapshot = JSON.parse(text)

    console.log(snapshot)

    return NextResponse.json(snapshot)
  } catch (err) {
    console.error("Error loading whiteboard:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}