"use client"

import TopicSidebar from "@/components/course/TopicSidebar"

interface Props {
  topicId: string
  courseId: string
}

export default function TopicClientPage({ topicId, courseId }: Props) {
  return (
    <div className="flex h-screen">
      <TopicSidebar topicId={topicId} courseId={courseId} />

      {/* Canvas Area */}
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">
          Canvas editor will live here.
        </div>
      </main>
    </div>
  )
}