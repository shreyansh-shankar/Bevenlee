"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createCourse } from "@/lib/api/course";

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
  userId: string;
  onCreated: () => void;
}

export function AddCourseModal({ isOpen, onClose, userId, onCreated }: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] =
    useState<"planned" | "active" | "paused" | "completed">("planned");
  const [projects_enabled, setProjects] = useState(true);
  const [assignments_enabled, setAssignments] = useState(true);
  const [type, setType] = useState("");
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !type) return;

    setLoading(true);
    setError(null);

    try {
      await createCourse({
        user_id: userId,
        title: name,
        purpose: purpose || undefined,
        type,
        status,
        priority,
        projects_enabled,
        assignments_enabled,
      });

      // reset
      setName("");
      setPurpose("");
      setType("");
      setStatus("planned");
      setPriority("medium");
      setProjects(true);
      setAssignments(true);

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-sm flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Add New Course
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-muted/20 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="React Basics"
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Purpose (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Purpose
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why are you taking this course?"
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background resize-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Type <span className="text-red-500">*</span>
            </label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Frontend / Backend / DSA"
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              Priority
            </label>
            <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Keep Projects
              </span>
              <Checkbox
                className="h-6 w-6"
                checked={projects_enabled}
                onCheckedChange={(c) => setProjects(!!c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Keep Assignments
              </span>
              <Checkbox
                className="h-6 w-6"
                checked={assignments_enabled}
                onCheckedChange={(c) => setAssignments(!!c)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!name || !type || loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
