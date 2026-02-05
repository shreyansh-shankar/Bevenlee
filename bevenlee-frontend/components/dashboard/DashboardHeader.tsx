"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddCourseModal } from "./AddCourseModal";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (course: any) => {
    console.log("New Course Data:", course);
    // TODO: Send to backend
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Courses</h1>
          <p className="text-sm text-muted-foreground">
            Track your learning progress across all courses
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} />
          Add New Course
        </button>
      </div>

      <AddCourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
