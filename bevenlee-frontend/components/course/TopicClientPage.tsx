"use client"

import TopicSidebar from "@/components/course/TopicSidebar"
import TopicWhiteboard from "./TopicWhiteboard"

interface Props {
  topicId: string
  courseId: string
}

export default function TopicClientPage({ topicId, courseId }: Props) {
  return (
    <div className="flex h-full overflow-hidden">
      <TopicSidebar topicId={topicId} courseId={courseId} />

      {/* Canvas Area */}
      <main className="flex-1 h-full">
        <TopicWhiteboard documentId={topicId} />
      </main>
    </div>
  )
}