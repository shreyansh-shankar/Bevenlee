"use client";

import { CourseSection } from "./CourseSection";
import { Project } from "@/lib/api/course";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableField } from "@/components/ui/EditableField";

interface Props {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, onChange }: Props) {
  const updateProject = (
    projectId: string,
    patch: Partial<Project>
  ) => {
    onChange(
      projects.map((p) =>
        p.project_id === projectId ? { ...p, ...patch } : p
      )
    );
  };

  return (
    <CourseSection
      title="Projects"
      description="Hands-on practical work"
    >
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="rounded-lg border p-4 flex flex-col gap-2"
            >
              {/* Title */}
              <EditableField
                value={project.title}
                onChange={(v) =>
                  updateProject(project.project_id, { title: v })
                }
                className="font-medium"
              >
                {({ value, onChange, onBlur }) => (
                  <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                  />
                )}
              </EditableField>

              {/* Description */}
              <EditableField
                value={project.description || "Add description…"}
                onChange={(v) =>
                  updateProject(project.project_id, {
                    description: v,
                  })
                }
                className="text-sm text-muted-foreground"
              >
                {({ value, onChange, onBlur }) => (
                  <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    rows={2}
                  />
                )}
              </EditableField>

              <span className="text-xs text-muted-foreground">
                Status: {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
