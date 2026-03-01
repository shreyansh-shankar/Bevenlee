"use client"

import { useState } from "react"
import { Roadmap } from "@/lib/api/roadmap"
import { RoadmapsContext } from "./RoadmapsContext"

export function RoadmapsProvider({
  initialRoadmaps,
  userId,
  children,
}: {
  initialRoadmaps: Roadmap[]
  userId: string
  children: React.ReactNode
}) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps)

  function addRoadmap(roadmap: Roadmap) {
    setRoadmaps(prev => [roadmap, ...prev])
  }

  function removeRoadmap(roadmapId: string) {
    setRoadmaps(prev => prev.filter(r => r.roadmap_id !== roadmapId))
  }

  return (
    <RoadmapsContext.Provider value={{ roadmaps, userId, addRoadmap, removeRoadmap }}>
      {children}
    </RoadmapsContext.Provider>
  )
}