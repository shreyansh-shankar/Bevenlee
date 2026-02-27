"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"
import StudySession from "@/components/course/topics/StudySession"
import {
    Trash2,
    Plus,
    ArrowLeft,
    Pencil,
    PanelLeftClose,
    PanelLeftOpen,
    SaveIcon,
} from "lucide-react"
import { useState, useRef } from "react"
import {
    updateTopicTitle,
    addSubtopic,
    toggleSubtopic,
    updateSubtopicTitle,
    deleteSubtopic,
} from "@/lib/course/topicMutations"
import { saveWhiteboardToBackend } from "@/lib/course/whiteboard"
import { useCourseEditor } from "@/components/course/editor/CourseEditorContext"
import { toast } from "@/hooks/use-toast"

interface Props {
    topicId: string
    courseId: string
}

export default function TopicSidebar({ topicId, courseId }: Props) {
    const router = useRouter()
    const { draft, setDraft, markDirty } = useCourseEditor()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [editingTopic, setEditingTopic] = useState(false)
    const [editingSubId, setEditingSubId] = useState<string | null>(null)
    const [collapsed, setCollapsed] = useState(false)
    const [isSaving, setIsSaving] = useState(false);

    const topicInputRef = useRef<HTMLInputElement>(null)

    const topic = draft.topics.find(t => t.id === topicId || t.topic_id === topicId)
    if (!topic || topic.isDeleted) return null
    const currentTopic = topic

    function handleTitleChange(title: string) {
        setDraft(d => updateTopicTitle(d, currentTopic.id, title))
        markDirty()
    }

    function handleAddSubtopic() {
        setDraft(d => addSubtopic(d, currentTopic.id))
        markDirty()
    }

    function handleToggle(subId: string) {
        setDraft(d => toggleSubtopic(d, currentTopic.id, subId))
        markDirty()
    }

    function handleSubtopicTitle(subId: string, title: string) {
        setDraft(d => updateSubtopicTitle(d, currentTopic.id, subId, title))
        markDirty()
    }

    function handleDeleteSubtopic(subId: string) {
        setDraft(d => deleteSubtopic(d, currentTopic.id, subId))
        markDirty()
    }

    async function handleSave() {
        const data = localStorage.getItem(`whiteboard-${currentTopic.id}`)
        if (!data) {
            toast({
                title: "Nothing to save",
                description: "No whiteboard data found to save.",
                variant: "destructive",
            })
            return;
        }
        setIsSaving(true);

        try {
            const parsed = JSON.parse(data)
            const result = await saveWhiteboardToBackend(currentTopic.id, parsed)

            if (result?.success) {
                toast({
                    title: "Whiteboard saved",
                    description: "Your changes have been saved successfully.",
                })
                return
            }
            if (result?.error === "PLAN_UPGRADE_REQUIRED") {
                setShowUpgrade(true)
                return
            }
            toast({
                title: "Save failed",
                description: result?.error || "Unknown error occurred.",
                variant: "destructive",
            })
        } catch (err: any) {
            if (err?.message?.includes("PLAN_UPGRADE_REQUIRED")) {
                setShowUpgrade(true)
                return
            }
            console.error("Save error:", err)
            toast({
                title: "Save failed",
                description: "Could not save whiteboard.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false);
        }
    }

    const visibleSubtopics = currentTopic.subtopics.filter(s => !s.isDeleted)

    return (
        <aside
            className={`border-r bg-muted/30 flex flex-col h-screen transition-all duration-300 overflow-hidden ${collapsed ? "w-20" : "w-80"
                }`}
        >
            {/* BACK + COLLAPSE ROW */}
            <div className="flex items-center justify-between p-2 border-b">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/course/${courseId}`)}
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {!collapsed && "Back to Course"}
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <PanelLeftOpen className="w-4 h-4" />
                    ) : (
                        <PanelLeftClose className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {/* ONLY SHOW CONTENT WHEN NOT COLLAPSED */}
            {!collapsed && (
                <div className="flex flex-col flex-1 px-4 py-2 overflow-hidden">
                    {/* TOPIC TITLE */}
                    <div className="p-4 border-b">
                        {editingTopic ? (
                            <Input
                                ref={topicInputRef}
                                value={currentTopic.title}
                                autoFocus
                                onChange={e => handleTitleChange(e.target.value)}
                                onBlur={() => setEditingTopic(false)}
                                className="text-lg font-semibold"
                            />
                        ) : (
                            <div
                                className="flex items-center justify-between group cursor-pointer"
                                onClick={() => setEditingTopic(true)}
                            >
                                <h2 className="text-lg font-semibold">
                                    {currentTopic.title || "Untitled topic"}
                                </h2>
                                <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                            </div>
                        )}
                    </div>

                    {/* SUBTOPICS LIST */}
                    <div className="flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-2 mt-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Subtopics
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleAddSubtopic}
                                className="h-7 px-2"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </div>

                        <ScrollArea className="h-[45vh]">
                            <div className="flex flex-col space-y-1">
                                {visibleSubtopics.map(sub => (
                                    <div
                                        key={sub.id}
                                        className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition"
                                    >
                                        <Checkbox
                                            checked={sub.is_completed}
                                            onCheckedChange={() => handleToggle(sub.id)}
                                        />

                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => setEditingSubId(sub.id)}
                                        >
                                            {editingSubId === sub.id ? (
                                                <Input
                                                    value={sub.title}
                                                    autoFocus
                                                    onChange={e =>
                                                        handleSubtopicTitle(sub.id, e.target.value)
                                                    }
                                                    onBlur={() => setEditingSubId(null)}
                                                    className="border-none shadow-none px-0 text-sm"
                                                />
                                            ) : (
                                                <span
                                                    className={`text-sm ${sub.is_completed
                                                        ? "line-through text-muted-foreground"
                                                        : ""
                                                        }`}
                                                >
                                                    {sub.title || "Untitled"}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex opacity-0 group-hover:opacity-100">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingSubId(sub.id)}
                                            >
                                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteSubtopic(sub.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* SAVE BUTTON BELOW SUBTOPICS */}
                        <div className="mt-4 mb-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center justify-center gap-2 w-full"
                                onClick={handleSave}
                            >
                                <SaveIcon className="w-4 h-4" />
                                {isSaving ? "Saving Whiteboard..." : "Save Whiteboard"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/*
              STUDY SESSION — always mounted outside the collapsed block.
              Using CSS visibility (hidden/visible + h-0/auto) keeps the component
              in the React tree so the timer and hook state are never destroyed.
            */}
            <div
                className={
                    collapsed
                        ? "invisible h-0 overflow-hidden"
                        : "px-4 pb-3"
                }
            >
                <StudySession topicId={topicId} />
            </div>

            {/* SAVE BUTTON ALWAYS VISIBLE (icon-only when collapsed) */}
            <div className="px-2 mx-auto mt-auto pb-4 pt-2 w-full">
                <Button
                    size="sm"
                    variant="outline"
                    className={`flex items-center justify-center gap-2 w-full ${collapsed ? "w-10 h-10 p-2 mx-auto" : ""
                        }`}
                    onClick={handleSave}
                    title={collapsed ? "Save Whiteboard" : undefined}
                >
                    {isSaving ? (
                        <span className="w-4 h-4 border-2 border-t-transparent border-b-transparent animate-spin rounded-full" />
                    ) : (
                        <SaveIcon className="w-4 h-4" />
                    )}
                    {!collapsed && (isSaving ? "Saving..." : "Save Whiteboard")}
                </Button>
            </div>

            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                message="Saving whiteboards is a Pro feature. Upgrade to unlock unlimited saves and keep your progress secure."
            />
        </aside>
    )
}