import { createClient } from "@/lib/supabase/server"

export async function getAuthTokenServer(): Promise<string> {
  const supabase = await createClient()
  
  // getUser() is secure — it verifies the token with Supabase Auth servers
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error("No active session")
  }

  // Re-fetch session only to get the access token, after user is verified above
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error("No active session")
  }

  return session.access_token
}