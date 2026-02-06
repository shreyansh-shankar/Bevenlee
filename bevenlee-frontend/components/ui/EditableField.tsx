"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditableField({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: (props: {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
  }) => React.ReactNode;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className={className}>
        {children({
          value,
          onChange,
          onBlur: () => setEditing(false),
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 cursor-pointer",
        className
      )}
      onClick={() => setEditing(true)}
    >
      <span>{value || "—"}</span>
      <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
    </div>
  );
}
