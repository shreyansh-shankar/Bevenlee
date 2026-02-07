"use client";

import { v4 as uuid } from "uuid";
import { CourseSection } from "./CourseSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableField } from "@/components/ui/EditableField";
import { Button } from "@/components/ui/button";

import { DraftProject } from "@/lib/course/draft";
import { useCourseEditor } from "./editor/CourseEditorContext";

export function ProjectsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();
  const projects = draft.projects.filter(p => !p.isDeleted);

  function updateProject(
    id: string,
    patch: Partial<DraftProject>
  ) {
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
        <Button size="sm" onClick={addProject}>
          + Add project
        </Button>
      }
    >
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="rounded-lg border p-4 flex flex-col gap-2"
            >
              {/* ───── Title ───── */}
              <EditableField
                value={project.title}
                onChange={v =>
                  updateProject(project.id, { title: v })
                }
                className="font-medium"
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* ───── Description ───── */}
              <EditableField
                value={project.description || "Add description…"}
                onChange={v =>
                  updateProject(project.id, {
                    description: v,
                  })
                }
                className="text-sm text-muted-foreground"
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    rows={2}
                  />
                )}
              </EditableField>

              {/* ───── Footer ───── */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Status: {project.status}
                </span>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteProject(project.id)}
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
