import { AuthButton } from "@/components/auth/AuthButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Link from "next/link";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="w-full sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <div className="h-16 w-full px-6 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="font-semibold text-sm tracking-tight hover:opacity-80 transition"
          >
            Next.js Supabase Starter
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

      {/* PAGE CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        {children}
      </div>
    </main>
  );
}
