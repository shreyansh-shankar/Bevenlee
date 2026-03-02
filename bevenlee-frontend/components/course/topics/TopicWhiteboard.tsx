"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import "@excalidraw/excalidraw/index.css"
import { fetchWhiteboardFromBackend } from "@/lib/course/whiteboard"

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false }
)

interface Props {
    documentId: string
}

export interface ExcalidrawSnapshot {
    elements: any[]
    appState: Record<string, any>
    files: Record<string, any>
}

export default function TopicWhiteboard({ documentId }: Props) {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [initialData, setInitialData] = useState<ExcalidrawSnapshot | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load snapshot BEFORE rendering Excalidraw, pass via initialData prop
    useEffect(() => {
        let cancelled = false

        async function loadSnapshot() {
            let snapshot: ExcalidrawSnapshot | null = null

            // 1. Try cloud (Pro plan)
            try {
                snapshot = await fetchWhiteboardFromBackend(documentId)
            } catch (err) {
                if (err instanceof Error && err.message === "PLAN_UPGRADE_REQUIRED") {
                    console.log("Cloud whiteboard locked → using local mode")
                }
            }

            // 2. Fallback to localStorage
            if (!snapshot) {
                const saved = localStorage.getItem(`whiteboard-${documentId}`)
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved)
                        if (Array.isArray(parsed?.elements)) {
                            snapshot = parsed
                        } else {
                            localStorage.removeItem(`whiteboard-${documentId}`)
                        }
                    } catch {
                        localStorage.removeItem(`whiteboard-${documentId}`)
                    }
                }
            }

            if (!cancelled) {
                setInitialData(snapshot)
                setIsLoading(false)
            }
        }

        loadSnapshot()
        return () => { cancelled = true }
    }, [documentId])

    const handleChange = useCallback(
        (elements: any[], appState: any, files: any) => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const snapshot: ExcalidrawSnapshot = {
                    elements,
                    appState: { viewBackgroundColor: appState.viewBackgroundColor },
                    files,
                }
                localStorage.setItem(
                    `whiteboard-${documentId}`,
                    JSON.stringify(snapshot)
                )
            }, 500)
        },
        [documentId]
    )

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    // Don't render Excalidraw at all until snapshot is loaded
    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-background/80">
                <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
                <p className="mt-3 text-sm text-muted-foreground">Loading whiteboard...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <Excalidraw
                initialData={
                    initialData
                        ? {
                              elements: initialData.elements,
                              appState: {
                                  viewBackgroundColor:
                                      initialData.appState?.viewBackgroundColor ?? "#ffffff",
                              },
                              files: initialData.files,
                          }
                        : null
                }
                onChange={(elements: any, appState: any, files: any) =>
                    handleChange(elements, appState, files)
                }
                UIOptions={{
                    canvasActions: {
                        saveToActiveFile: false,
                        loadScene: false,
                    },
                }}
            />
        </div>
    )
}