"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EditableField } from "../ui/EditableField";

import { useCourseEditor } from "./editor/CourseEditorContext";

export function CourseHeader() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const update = (patch: Partial<typeof draft>) => {
    setDraft(d => ({
      ...d,
      ...patch,
      isDirty: true,
    }));
  };

  if (!draft) return null;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* ───────── TITLE + META ───────── */}
      <div className="flex flex-col gap-4 max-w-5xl">
        {/* TITLE */}
        <EditableField
          value={draft.title}
          onChange={(v) => update({ title: v })}
          className="text-3xl font-semibold tracking-tight"
        >
          {({ value, onChange, onBlur }) => (
            <Input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className="
                text-3xl font-semibold
                px-3 py-2
                rounded-lg
                border border-transparent
                focus-visible:border-border
                focus-visible:bg-muted/40
                focus-visible:ring-0
              "
            />
          )}
        </EditableField>

        {/* META ROW */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {/* TYPE */}
          <EditableField
            value={draft.type}
            onChange={(v) => update({ type: v })}
          >
            {({ value, onChange, onBlur }) => (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className="
                  w-40
                  px-2 py-1
                  rounded-md
                  border border-transparent
                  focus-visible:border-border
                  focus-visible:bg-muted/40
                  focus-visible:ring-0
                "
              />
            )}
          </EditableField>

          {/* PRIORITY */}
          <Select
            value={draft.priority}
            onValueChange={(v) =>
              update({ priority: v as typeof draft.priority })
            }
          >
            <SelectTrigger className="h-8 w-32 px-3 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* STATUS */}
          <Select
            value={draft.status}
            onValueChange={(v) =>
              update({ status: v as typeof draft.status })
            }
          >
            <SelectTrigger className="h-8 w-36 px-3 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <StatusBadge status={draft.status} />
        </div>
      </div>

      {/* ───────── DESCRIPTION ───────── */}
      <EditableField
        value={draft.purpose || "Add a short description…"}
        onChange={(v) => update({ purpose: v })}
        className="text-sm text-muted-foreground max-w-4xl"
      >
        {({ value, onChange, onBlur }) => (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={3}
            className="
              px-3 py-2
              rounded-lg
              border border-transparent
              focus-visible:border-border
              focus-visible:bg-muted/40
              focus-visible:ring-0
              resize-none
              text-sm
            "
          />
        )}
      </EditableField>

      {/* ───────── TOGGLES ───────── */}
      <div className="flex gap-8 pt-2 text-sm text-muted-foreground">
        <label className="flex items-center gap-2">
          <Switch
            checked={draft.projects_enabled}
            onCheckedChange={(v) =>
              update({ projects_enabled: v })
            }
          />
          Projects
        </label>

        <label className="flex items-center gap-2">
          <Switch
            checked={draft.assignments_enabled}
            onCheckedChange={(v) =>
              update({ assignments_enabled: v })
            }
          />
          Assignments
        </label>
      </div>
    </div>
  );
}
