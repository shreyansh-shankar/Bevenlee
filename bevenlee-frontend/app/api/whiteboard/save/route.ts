import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserPlan } from "@/lib/backend/plan";

export async function POST(req: NextRequest) {
  try {
    const { documentId, snapshot } = await req.json();

    if (!documentId || !snapshot) {
      return NextResponse.json(
        { error: "Missing documentId or snapshot" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 🔐 Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🧠 Fetch plan from backend
    const planData = await fetchUserPlan(user.id);

    const isFreePlan = planData.plan.id === 0;

    if (isFreePlan) {
      return NextResponse.json(
        {
          error: "PLAN_UPGRADE_REQUIRED",
          message: "Whiteboard saving is available on Pro plan.",
        },
        { status: 403 }
      );
    }

    const jsonString = JSON.stringify(snapshot);

    // 💾 Save to Supabase Storage
    const { error } = await supabase.storage
      .from("whiteboards")
      .upload(`whiteboard-${documentId}.json`, jsonString, {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json(
        { error: "Failed to save snapshot" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error in whiteboard save API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}