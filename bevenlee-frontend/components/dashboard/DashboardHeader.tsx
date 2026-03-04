"use client";

import { useState } from "react";
import { Plus, Map, ClipboardPaste } from "lucide-react";
import { AddCourseModal } from "./AddCourseModal";
import { PasteCourseModal } from "./PasteCourseModal";
import { useRouter } from "next/navigation";
import { Course } from "@/lib/api/course";

interface DashboardHeaderProps {
  userId: string;
  onCourseCreated: () => void;
}

export function DashboardHeader({ userId, onCourseCreated }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Courses</h1>
          <p className="text-sm text-muted-foreground">
            Track your learning progress across all courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/roadmaps")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40 transition"
          >
            <Map size={16} />
            Roadmaps
          </button>
          <button
            onClick={() => setPasteOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40 transition"
          >
            <ClipboardPaste size={16} />
            Import Course
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
            onClick={() => setOpen(true)}
          >
            <Plus size={16} />
            Add New Course
          </button>
        </div>
      </div>

      <AddCourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        userId={userId}
        onCreated={(course: Course) => {
          onCourseCreated();
          setOpen(false);
        }}
      />

      <PasteCourseModal
        isOpen={pasteOpen}
        onClose={() => setPasteOpen(false)}
        userId={userId}
        onCreated={(course: Course) => {
          onCourseCreated();
          setPasteOpen(false);
        }}
      />
    </>
  );
}