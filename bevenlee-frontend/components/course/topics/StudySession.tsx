"use client"

import { useStudySession } from "@/hooks/useStudySession"
import { Button } from "@/components/ui/button"
import { PlayCircle, StopCircle, Clock, Flame, BookOpen } from "lucide-react"

interface Props {
  topicId: string
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function StudySession({ topicId }: Props) {
  const { isRunning, elapsedSeconds, stats, isLoadingStats, isSaving, start, stop } =
    useStudySession({ topicId })

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Study Session
        </span>
        {isSaving && (
          <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>
        )}
      </div>

      <div className="px-3 py-3 flex flex-col gap-3">
        {/* Live Timer */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-3xl font-mono font-bold tabular-nums transition-colors ${
              isRunning ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {formatTime(elapsedSeconds)}
          </div>

          {isRunning ? (
            <Button
              size="sm"
              variant="destructive"
              className="w-full flex items-center gap-2"
              onClick={stop}
            >
              <StopCircle className="w-4 h-4" />
              Stop Session
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={start}
            >
              <PlayCircle className="w-4 h-4" />
              Start Session
            </Button>
          )}

          {isRunning && (
            <p className="text-xs text-muted-foreground text-center">
              Session will save automatically when you leave
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-1 border-t pt-3">
          {/* Today */}
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">
              {isLoadingStats ? "—" : formatMinutes(stats?.today_minutes ?? 0)}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">Today</span>
          </div>

          {/* Sessions */}
          <div className="flex flex-col items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">
              {isLoadingStats ? "—" : (stats?.total_sessions ?? 0)}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">Sessions</span>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium">
              {isLoadingStats ? "—" : `${stats?.streak_days ?? 0}d`}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">Streak</span>
          </div>
        </div>
      </div>
    </div>
  )
}