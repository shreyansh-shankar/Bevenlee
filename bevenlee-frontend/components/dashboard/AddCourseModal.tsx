"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { APIError, Course } from "@/lib/api/course";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createCourseAction } from "@/lib/course/createCourseAction";

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
  onCreated: (course: Course) => void;
}

export function AddCourseModal({
  isOpen,
  onClose,
  userId,
  onCreated,
}: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] =
    useState<"planned" | "active" | "paused" | "completed">("planned");
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium");
  const [projectsEnabled, setProjectsEnabled] = useState(true);
  const [assignmentsEnabled, setAssignmentsEnabled] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setPurpose("");
    setType("");
    setStatus("planned");
    setPriority("medium");
    setProjectsEnabled(true);
    setAssignmentsEnabled(true);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name || !type) return;

    setLoading(true);
    setError(null);

    try {
      const data = await createCourseAction({
        userId,
        title: name,
        purpose: purpose || undefined,
        type,
        status,
        priority,
        projectsEnabled,
        assignmentsEnabled,
      });

      resetForm();
      onCreated(data.course);
      onClose();

    } catch (err: unknown) {
      if (err instanceof APIError) {
        if (err.code === "PLAN_LIMIT_EXCEEDED") {
          setShowUpgrade(true);
          return;
        }
        setError(err.message);
        return;
      }
      setError("Something went wrong. Please try again.");
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

          {/* Purpose */}
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
                checked={projectsEnabled}
                onCheckedChange={(c) => setProjectsEnabled(!!c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Keep Assignments
              </span>
              <Checkbox
                className="h-6 w-6"
                checked={assignmentsEnabled}
                onCheckedChange={(c) => setAssignmentsEnabled(!!c)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleSubmit} disabled={!name || !type || loading}>
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </Dialog.Panel>
        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          message="You've reached the course limit for your current plan. Upgrade to create more courses."
        />
      </div>
    </Dialog>
  );
}