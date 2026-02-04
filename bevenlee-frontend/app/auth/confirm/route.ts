import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    // This VERIFY step confirms the email (DB level)
    await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
  }

  // ALWAYS redirect to login
  redirect("/auth/login?verified=1");
}
