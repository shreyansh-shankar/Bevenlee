"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { saveStudySession, fetchSessionStats, SessionStats } from "@/lib/course/sessions"
import { toast } from "@/hooks/use-toast"

interface UseStudySessionOptions {
  topicId: string
}

export function useStudySession({ topicId }: UseStudySessionOptions) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const startedAtRef = useRef<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load stats on mount
  useEffect(() => {
    fetchSessionStats(topicId).then((data) => {
      setStats(data)
      setIsLoadingStats(false)
    })
  }, [topicId])

  // Tick every second when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const stopAndSave = useCallback(
    async (silent = false) => {
      // Capture ref immediately before any async/state changes
      const startedAt = startedAtRef.current
      if (!isRunning || !startedAt) return

      setIsRunning(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      startedAtRef.current = null

      const durationMinutes = Math.floor(elapsedSeconds / 60)

      // Only save if at least 1 minute studied
      if (durationMinutes < 1) {
        setElapsedSeconds(0)
        return
      }

      setIsSaving(true)
      const result = await saveStudySession(topicId, startedAt, durationMinutes)
      setIsSaving(false)

      if (result.success) {
        // Optimistically update stats
        setStats((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            today_minutes: prev.today_minutes + durationMinutes,
            total_sessions: prev.total_sessions + 1,
            sessions: [
              ...prev.sessions,
              {
                topic_id: topicId,
                started_at: startedAtRef.current!.toISOString(),
                duration_minutes: durationMinutes,
              },
            ],
          }
        })
        if (!silent) {
          toast({
            title: "Session saved",
            description: `Great work! ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""} logged.`,
          })
        }
      } else {
        if (!silent) {
          toast({
            title: "Couldn't save session",
            description: result.error ?? "Unknown error",
            variant: "destructive",
          })
        }
      }

      setElapsedSeconds(0)
    },
    [isRunning, elapsedSeconds, topicId]
  )

  // Auto-stop on page close / tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning && startedAtRef.current) {
        const durationMinutes = Math.floor(elapsedSeconds / 60)
        if (durationMinutes >= 1) {
          // Use sendBeacon for reliability on page unload
          const token = "" // sendBeacon can't set auth headers easily; handled server-side via cookie
          navigator.sendBeacon(
            "/api/sessions/save",
            JSON.stringify({
              topic_id: topicId,
              started_at: startedAtRef.current.toISOString(),
              duration_minutes: durationMinutes,
            })
          )
        }
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isRunning, elapsedSeconds, topicId])

  // Auto-stop on component unmount (navigate away within app)
  useEffect(() => {
    return () => {
      if (isRunning && startedAtRef.current) {
        stopAndSave(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function start() {
    startedAtRef.current = new Date()
    setElapsedSeconds(0)
    setIsRunning(true)
  }

  return {
    isRunning,
    elapsedSeconds,
    stats,
    isLoadingStats,
    isSaving,
    start,
    stop: () => stopAndSave(false),
  }
}