"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, Map, Star, Download } from "lucide-react"
import { LibraryItem } from "@/lib/library/api"
import { cn } from "@/lib/utils"

interface Props {
  item: LibraryItem
  onLike: (itemId: string) => void
  onClone: (item: LibraryItem) => void
  isLiking?: boolean
}

export function LibraryCard({ item, onLike, onClone, isLiking }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">

      {/* ── Top row: type badge + admin pick ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {item.item_type === "course" ? (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <BookOpen className="w-3 h-3" />
              Course
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Map className="w-3 h-3" />
              Roadmap
            </Badge>
          )}
          {item.is_admin_pick && (
            <Badge className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-500 text-white">
              <Star className="w-3 h-3 fill-white" />
              Staff pick
            </Badge>
          )}
        </div>

        {/* Whiteboard indicator */}
        {item.whiteboards && (
          <span className="text-xs text-muted-foreground">Includes notes</span>
        )}
      </div>

      {/* ── Title + description ── */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-base leading-snug">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* ── Footer: like + clone ── */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onLike(item.item_id)}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            item.user_liked
              ? "text-rose-500"
              : "text-muted-foreground hover:text-rose-500"
          )}
        >
          <Heart
            className={cn("w-4 h-4", item.user_liked && "fill-rose-500")}
          />
          <span>{item.like_count}</span>
        </button>

        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1.5"
          onClick={() => onClone(item)}
        >
          <Download className="w-3.5 h-3.5" />
          Clone
        </Button>
      </div>
    </div>
  )
}