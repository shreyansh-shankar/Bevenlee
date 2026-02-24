"use client";

import { getInitials } from "@/lib/profile/getInitials";

interface Props {
  name: string;
  avatarUrl?: string | null;
}

export default function AvatarPicker({ name, avatarUrl }: Props) {
  const initials = getInitials(name);

  return (
    <div className="relative">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-20 h-20 rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground ring-2 ring-border">
          {initials}
        </div>
      )}

      {/* disabled change button */}
      <button
        disabled
        className="absolute bottom-0 right-0 text-xs px-2 py-1 rounded-md border bg-background text-muted-foreground opacity-60 cursor-not-allowed"
      >
        Change
      </button>
    </div>
  );
}