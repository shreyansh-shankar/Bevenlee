"use client";

import { CourseLayout } from "./CourseLayout";
import { CourseHeader } from "./elements/CourseHeader";
import { TopicsSection } from "./elements/TopicsSection";
import { ResourcesSection } from "./elements/ResourcesSection";
import { ProjectsSection } from "./elements/ProjectsSection";
import { AssignmentsSection } from "./elements/AssignmentsSection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { useCourseEditor } from "./editor/CourseEditorContext";
import { saveCourse, APIError } from "@/lib/api/course";
import { serializeDraftCourse } from "./editor/serialize";

export function CourseClientPage() {
  const { draft, setDraft } = useCourseEditor();
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleSave() {
    if (isSaving) return; // prevent double click

    try {
      setIsSaving(true);

      await saveCourse(
        draft.course_id,
        serializeDraftCourse(draft)
      );

      setDraft(d => ({
        ...d,
        isDirty: false,
        lastSavedAt: new Date().toISOString(),
      }));
    } catch (err) {
      if (err instanceof APIError) {
        // Topic limit → upgrade modal (expected flow)
        if (err.code === "TOPIC_LIMIT_EXCEEDED") {
          setShowUpgrade(true);
          return;
        }

        // other backend errors
        alert(err.message);
        return;
      }

      // ❗ Only log unexpected errors
      console.error("Unexpected save error:", err);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CourseLayout>
      {/* ───────────────── Header + Save ───────────────── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
        <div className="flex items-start justify-between gap-8 px-8 py-6">
          {/* Header */}
          <div className="flex-1">
            <CourseHeader />
          </div>

          {/* Save */}
          <div className="shrink-0 pt-2 flex flex-col items-end gap-1">
            <Button
              size="sm"
              disabled={!draft.isDirty || isSaving}
              onClick={handleSave}
            >
              {isSaving
                ? "Saving changes…"
                : draft.lastSavedAt && !draft.isDirty
                  ? "Saved ✓"
                  : "Save changes"}
            </Button>

            {draft.lastSavedAt && !draft.isDirty && !isSaving && (
              <span className="text-xs text-muted-foreground">
                Last saved{" "}
                {new Date(draft.lastSavedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────── Workspace ───────────────── */}
      <div className="grid grid-cols-12 gap-10 px-8 pb-16">
        {/* LEFT */}
        <div className="col-span-8 flex flex-col gap-10">
          <TopicsSection />
          <ResourcesSection />
        </div>

        {/* RIGHT */}
        <div className="col-span-4 flex flex-col gap-6">
          {draft.assignments_enabled && <AssignmentsSection />}
          {draft.projects_enabled && <ProjectsSection />}
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="You’ve reached the topics limit for your current plan. Upgrade to create more topics."
      />
    </CourseLayout>
  );
}
