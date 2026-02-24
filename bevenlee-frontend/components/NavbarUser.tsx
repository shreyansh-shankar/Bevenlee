"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getInitials } from "@/lib/profile/getInitials";
import { LogoutButton } from "@/components/auth/LogoutButton";

interface Props {
  name: string;
  email: string;
}

export function NavbarUser({ name, email }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = getInitials(name || email);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition"
      >
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>

        <span className="text-sm font-medium hidden sm:inline">
          {name || email}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border bg-popover shadow-lg p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition"
          >
            Profile
          </Link>

          <Link
            href="/billing"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition"
          >
            Billing
          </Link>

          <div className="border-t my-1" />

          <LogoutButton
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-red-500/10 text-red-600 hover:text-red-700 transition"
          />
        </div>
      )}
    </div>
  );
}