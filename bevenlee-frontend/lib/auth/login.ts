import { createClient } from "@/lib/supabase/client";

type LoginParams = {
  email: string;
  password: string;
};

export async function loginWithEmail({ email, password }: LoginParams) {
  const supabase = createClient();

  // Sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sync with backend
  if (user) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
        provider: "email",
      }),
    });
  }

  return user;
}