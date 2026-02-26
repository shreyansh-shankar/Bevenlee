import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

export async function getAuthToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error("No active session")
  }
  
  return session.access_token
}