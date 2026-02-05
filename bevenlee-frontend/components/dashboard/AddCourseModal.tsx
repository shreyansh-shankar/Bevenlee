"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface AddCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (course: {
        name: string;
        purpose: string;
        status: "planned" | "active" | "paused" | "completed";
        projects: boolean;
        assignments: boolean;
        type: string;
        priority: "low" | "medium" | "high";
    }) => void;
}

export function AddCourseModal({ isOpen, onClose, onSubmit }: AddCourseModalProps) {
    const [name, setName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [status, setStatus] = useState<"planned" | "active" | "paused" | "completed">("planned");
    const [projects, setProjects] = useState(true);
    const [assignments, setAssignments] = useState(true);
    const [type, setType] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    const handleSubmit = () => {
        onSubmit({
            name,
            purpose,
            status,
            projects,
            assignments,
            type,
            priority,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-sm flex flex-col gap-5">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-xl font-semibold">Add New Course</Dialog.Title>
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-muted/20 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Course Name <span>*</span></label>
                        <input
                            type="text"
                            className={`rounded-lg border px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent ${!name ? "" : "border-border"
                                }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="React Basics"
                        />
                    </div>

                    {/* Purpose */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Purpose</label>
                        <textarea
                            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="Why are you taking this course?"
                        />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Type <span>*</span></label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Enter course type"
                            className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent ${!type ? "" : "border-border"
                                }`}
                        />
                    </div>

                    {/* Status (modern select) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority (modern select) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Priority</label>
                        <Select value={priority} onValueChange={(val) => setPriority(val as any)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Projects / Assignments (Checkbox) */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Keep Projects</span>
                            <Checkbox
                                checked={projects}
                                onCheckedChange={(checked) => setProjects(!!checked)}
                                className="h-6 w-6"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Keep Assignments</span>
                            <Checkbox
                                checked={assignments}
                                onCheckedChange={(checked) => setAssignments(!!checked)}
                                className="h-6 w-6"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={!name || !type}
                    >
                        Create Course
                    </Button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
