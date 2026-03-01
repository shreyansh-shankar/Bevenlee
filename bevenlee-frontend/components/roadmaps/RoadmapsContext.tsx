"use client"

import { createContext, useContext } from "react"
import { Roadmap } from "@/lib/api/roadmap"

interface RoadmapsContextValue {
  roadmaps: Roadmap[]
  userId: string
  addRoadmap: (roadmap: Roadmap) => void
  removeRoadmap: (roadmapId: string) => void
}

export const RoadmapsContext = createContext<RoadmapsContextValue | null>(null)

export function useRoadmaps() {
  const ctx = useContext(RoadmapsContext)
  if (!ctx) throw new Error("useRoadmaps must be used inside RoadmapsProvider")
  return ctx
}