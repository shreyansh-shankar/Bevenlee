"use client";

import { useEffect, useRef, useState } from "react";
import { CourseEditorContext } from "./CourseEditorContext";
import { DraftCourse, hydrateDraftCourse } from "@/lib/course/draft";

export function CourseEditorProvider({
  initialData,
  children,
}: {
  initialData: any;
  children: React.ReactNode;
}) {
  const [draft, _setDraft] = useState<DraftCourse | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current && initialData?.course) {
      _setDraft(hydrateDraftCourse(initialData));
      hasHydrated.current = true;
    }
  }, [initialData]);

  // ✅ non-null safe setter exposed to consumers
  const setDraft: React.Dispatch<
    React.SetStateAction<DraftCourse>
  > = (updater) => {
    _setDraft(prev => {
      if (!prev) return prev;

      return typeof updater === "function"
        ? (updater as (d: DraftCourse) => DraftCourse)(prev)
        : updater;
    });
  };

  function markDirty() {
    setDraft(d => ({ ...d, isDirty: true }));
  }

  if (!draft) return null; // loading / skeleton

  return (
    <CourseEditorContext.Provider
      value={{ draft, setDraft, markDirty }}
    >
      {children}
    </CourseEditorContext.Provider>
  );
}
