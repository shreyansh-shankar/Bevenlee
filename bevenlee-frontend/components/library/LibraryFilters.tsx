"use client"

import { Button } from "@/components/ui/button"
import { LibraryFilter } from "@/lib/library/api"
import { BookOpen, Map, LayoutGrid, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  activeFilter: LibraryFilter
  likedOnly: boolean
  onFilterChange: (f: LibraryFilter) => void
  onLikedOnlyChange: (v: boolean) => void
}

const FILTERS: { value: LibraryFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: "course", label: "Courses", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { value: "roadmap", label: "Roadmaps", icon: <Map className="w-3.5 h-3.5" /> },
]

export function LibraryFilters({
  activeFilter,
  likedOnly,
  onFilterChange,
  onLikedOnlyChange,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">

      {/* Type filters */}
      <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/40">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Liked only toggle */}
      <button
        onClick={() => onLikedOnlyChange(!likedOnly)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
          likedOnly
            ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400"
            : "bg-muted/40 text-muted-foreground hover:text-foreground"
        )}
      >
        <Heart className={cn("w-3.5 h-3.5", likedOnly && "fill-rose-500 text-rose-500")} />
        Liked
      </button>
    </div>
  )
}