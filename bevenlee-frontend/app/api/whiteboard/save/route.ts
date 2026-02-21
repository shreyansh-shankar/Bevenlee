import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // use your server-side client

export async function POST(req: NextRequest) {
  try {
    const { documentId, snapshot } = await req.json();

    if (!documentId || !snapshot) {
      return NextResponse.json({ error: "Missing documentId or snapshot" }, { status: 400 });
    }

    const supabase = await createClient(); // server-side client

    const jsonString = JSON.stringify(snapshot);

    // Save to Supabase Storage bucket
    const { error } = await supabase.storage
      .from("whiteboards")
      .upload(`whiteboard-${documentId}.json`, jsonString, {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: "Failed to save snapshot" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in whiteboard save API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}