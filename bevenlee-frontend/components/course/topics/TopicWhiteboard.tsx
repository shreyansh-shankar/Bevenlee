"use client"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import { useCallback, useRef, useState } from "react"
import { fetchWhiteboardFromBackend } from "@/lib/course/whiteboard"

interface Props {
  documentId: string
}

export default function TopicWhiteboard({ documentId }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleMount = useCallback((editor: any) => {
    (async () => {
      let snapshot = await fetchWhiteboardFromBackend(documentId)

      if (!snapshot) {
        const saved = localStorage.getItem(`whiteboard-${documentId}`)
        if (saved) {
          try {
            snapshot = JSON.parse(saved)
            if (!snapshot?.schema?.schemaVersion) {
              snapshot = null
              localStorage.removeItem(`whiteboard-${documentId}`)
            }
          } catch {
            localStorage.removeItem(`whiteboard-${documentId}`)
          }
        }
      }

      if (snapshot?.schema?.schemaVersion) {
        try {
          editor.loadSnapshot(snapshot)
          localStorage.setItem(`whiteboard-${documentId}`, JSON.stringify(snapshot))
        } catch (err) {
          console.error("Failed to load snapshot into editor:", err)
        }
      }

      setIsLoading(false)
    })()

    const cleanup = editor.store.listen(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const latest = editor.store.getSnapshot()
        localStorage.setItem(`whiteboard-${documentId}`, JSON.stringify(latest))
      }, 500)
    },
      { source: "user", scope: "document" }
    )

    return () => {
      cleanup()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [documentId])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
          <p className="mt-3 text-sm text-muted-foreground">Loading whiteboard...</p>
        </div>
      )}
      <Tldraw autoFocus onMount={handleMount} />
    </div>
  )
}