import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AuthButton } from "@/components/auth/AuthButton";

export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-semibold text-sm tracking-tight hover:opacity-80 transition"
        >
          APP-NAME
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
