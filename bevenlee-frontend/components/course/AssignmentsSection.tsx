"use client";

import { Assignment } from "@/lib/api/course";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  assignments: Assignment[];
  onChange: (assignments: Assignment[]) => void;
}

export function AssignmentsSection({
  assignments,
  onChange,
}: Props) {
  const updateAssignment = (
    assignmentId: string,
    patch: Partial<Assignment>
  ) => {
    onChange(
      assignments.map((a) =>
        a.assignment_id === assignmentId
          ? { ...a, ...patch }
          : a
      )
    );
  };

  return (
    <CourseSection
      title="Assignments"
      description="Evaluate your understanding"
    >
      {assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No assignments added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.assignment_id}
              className="rounded-lg border p-4 flex flex-col gap-2"
            >
              {/* Title */}
              <EditableField
                value={assignment.title}
                onChange={(v) =>
                  updateAssignment(assignment.assignment_id, {
                    title: v,
                  })
                }
                className="font-medium"
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={(e) =>
                      onChange(e.target.value)
                    }
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* Description */}
              <EditableField
                value={
                  assignment.description || "Add description…"
                }
                onChange={(v) =>
                  updateAssignment(assignment.assignment_id, {
                    description: v,
                  })
                }
                className="text-sm text-muted-foreground"
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    rows={2}
                    value={value}
                    onChange={(e) =>
                      onChange(e.target.value)
                    }
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* Status */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Status:</span>
                <Select
                  value={assignment.status}
                  onValueChange={(v) =>
                    updateAssignment(
                      assignment.assignment_id,
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
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
