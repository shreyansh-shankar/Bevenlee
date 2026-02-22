import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}