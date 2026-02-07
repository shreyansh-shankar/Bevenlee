"use client";

import { createContext, useContext } from "react";
import { DraftCourse } from "@/lib/course/draft";

interface CourseEditorContextValue {
  draft: DraftCourse;
  setDraft: React.Dispatch<React.SetStateAction<DraftCourse>>;

  markDirty: () => void;
}

export const CourseEditorContext =
  createContext<CourseEditorContextValue | null>(null);

export function useCourseEditor() {
  const ctx = useContext(CourseEditorContext);
  if (!ctx) {
    throw new Error("useCourseEditor must be used inside CourseEditorProvider");
  }
  return ctx;
}
