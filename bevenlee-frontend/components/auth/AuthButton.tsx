import { createClient } from "@/lib/supabase/server";
import { Button } from "../ui/button";
import Link from "next/link";
import { NavbarUser } from "..//NavbarUser";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <NavbarUser
      name={user.user_metadata?.full_name || ""}
      email={user.email!}
    />
  );
}