"use client"

import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import { useCallback } from "react"

interface Props {
  documentId: string
}

export default function TopicWhiteboard({ documentId }: Props) {
  const handleMount = useCallback((editor: any) => {
    // ✅ Load saved snapshot
    const saved = localStorage.getItem(`whiteboard-${documentId}`)
    if (saved) {
      editor.store.loadStoreSnapshot(JSON.parse(saved))
    }

    // ✅ Listen for changes & auto-save
    const cleanup = editor.store.listen(() => {
      const snapshot = editor.store.serialize()

      localStorage.setItem(
        `whiteboard-${documentId}`,
        JSON.stringify(snapshot)
      )
    })

    return cleanup
  }, [documentId])

  return (
    <div className="w-full h-full">
      <Tldraw autoFocus onMount={handleMount} />
    </div>
  )
}