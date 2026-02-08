"use client";

import { v4 as uuid } from "uuid";
import { Plus, Trash2 } from "lucide-react";

import { CourseSection } from "./CourseSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableField } from "@/components/ui/EditableField";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DraftProject } from "@/lib/course/draft";
import { useCourseEditor } from "./editor/CourseEditorContext";

export function ProjectsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();
  const projects = draft.projects.filter(p => !p.isDeleted);

  function updateProject(id: string, patch: Partial<DraftProject>) {
    setDraft(d => ({
      ...d,
      projects: d.projects.map(p =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
    markDirty();
  }

  function addProject() {
    setDraft(d => ({
      ...d,
      projects: [
        ...d.projects,
        {
          id: `temp_${uuid()}`,
          project_id: null,
          title: "New project",
          status: "planned",
          description: null,
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteProject(id: string) {
    setDraft(d => ({
      ...d,
      projects: d.projects.map(p =>
        p.id === id ? { ...p, isDeleted: true } : p
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Projects"
      description="Hands-on practical work"
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={addProject}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      }
    >
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects added yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          {projects.map(project => (
            <div
              key={project.id}
              className="flex flex-col gap-2 py-2 px-2 rounded transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {/* ───── Title ───── */}
              <EditableField
                value={project.title}
                onChange={v => updateProject(project.id, { title: v })}
                className="font-medium"
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder="Project title"
                    className="border-none px-0 py-1 text-base focus:ring-0 focus:outline-none bg-transparent"
                  />
                )}
              </EditableField>

              {/* ───── Description ───── */}
              <EditableField
                value={project.description || ""}
                onChange={v => updateProject(project.id, { description: v })}
                className="text-sm text-muted-foreground"
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    rows={2}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder="Add description…"
                    className="border-none px-0 py-1 text-sm focus:ring-0 focus:outline-none bg-transparent text-muted-foreground"
                  />
                )}
              </EditableField>

              {/* ───── Status + Delete ───── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Status:</span>
                  <Select
                    value={project.status}
                    onValueChange={v => updateProject(project.id, { status: v })}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 text-white-500 hover:text-white-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
