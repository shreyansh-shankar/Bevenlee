import { createClient } from "@/lib/supabase/client";

type SignUpParams = {
  email: string;
  password: string;
  fullName: string;
};

export async function signUpWithEmail({
  email,
  password,
  fullName,
}: SignUpParams) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  return true;
}