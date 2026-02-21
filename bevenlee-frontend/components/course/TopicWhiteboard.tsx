"use client"

import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import { useCallback } from "react"

interface Props {
  documentId: string
}

export default function TopicWhiteboard({ documentId }: Props) {
  const handleMount = useCallback((editor: any) => {
    // ✅ Load saved snapshot safely
    const saved = localStorage.getItem(`whiteboard-${documentId}`)
    if (saved) {
      try {
        const snapshot = JSON.parse(saved)

        // Only load if schemaVersion exists
        if (snapshot?.schemaVersion) {
          editor.store.loadStoreSnapshot(snapshot)
        } else {
          console.warn(
            `Invalid whiteboard snapshot for document ${documentId}. Skipping load.`
          )
          localStorage.removeItem(`whiteboard-${documentId}`)
        }
      } catch (err) {
        console.error("Failed to parse whiteboard snapshot:", err)
        localStorage.removeItem(`whiteboard-${documentId}`)
      }
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