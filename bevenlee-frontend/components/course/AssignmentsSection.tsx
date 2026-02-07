"use client";

import { v4 as uuid } from "uuid";

import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DraftAssignment } from "@/lib/course/draft";
import { useCourseEditor } from "./editor/CourseEditorContext";

export function AssignmentsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const assignments = draft.assignments.filter(
    a => !a.isDeleted
  );

  function updateAssignment(
    id: string,
    patch: Partial<DraftAssignment>
  ) {
    setDraft(d => ({
      ...d,
      assignments: d.assignments.map(a =>
        a.id === id ? { ...a, ...patch } : a
      ),
    }));
    markDirty();
  }

  function addAssignment() {
    setDraft(d => ({
      ...d,
      assignments: [
        ...d.assignments,
        {
          id: `temp_${uuid()}`,
          assignment_id: null,
          title: "New assignment",
          status: "pending",
          description: null,
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteAssignment(id: string) {
    setDraft(d => ({
      ...d,
      assignments: d.assignments.map(a =>
        a.id === id ? { ...a, isDeleted: true } : a
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Assignments"
      description="Evaluate your understanding"
      action={
        <Button size="sm" onClick={addAssignment}>
          + Add assignment
        </Button>
      }
    >
      {assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No assignments added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map(assignment => (
            <div
              key={assignment.id}
              className="rounded-lg border p-4 flex flex-col gap-2"
            >
              {/* ───── Title ───── */}
              <EditableField
                value={assignment.title}
                onChange={v =>
                  updateAssignment(assignment.id, {
                    title: v,
                  })
                }
                className="font-medium"
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={e =>
                      onChange(e.target.value)
                    }
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* ───── Description ───── */}
              <EditableField
                value={
                  assignment.description ||
                  "Add description…"
                }
                onChange={v =>
                  updateAssignment(assignment.id, {
                    description: v,
                  })
                }
                className="text-sm text-muted-foreground"
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    rows={2}
                    value={value}
                    onChange={e =>
                      onChange(e.target.value)
                    }
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* ───── Status + Delete ───── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Status:</span>
                  <Select
                    value={assignment.status}
                    onValueChange={v =>
                      updateAssignment(
                        assignment.id,
                        { status: v }
                      )
                    }
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        Pending
                      </SelectItem>
                      <SelectItem value="active">
                        Active
                      </SelectItem>
                      <SelectItem value="completed">
                        Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    deleteAssignment(assignment.id)
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
