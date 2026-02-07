"use client";

import { v4 as uuid } from "uuid";
import { ExternalLink } from "lucide-react";

import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DraftResource } from "@/lib/course/draft";
import { useCourseEditor } from "./editor/CourseEditorContext";

export function ResourcesSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const resources = draft.resources.filter(r => !r.isDeleted);

  function updateResource(
    id: string,
    patch: Partial<DraftResource>
  ) {
    setDraft(d => ({
      ...d,
      resources: d.resources.map(r =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }));
    markDirty();
  }

  function addResource() {
    setDraft(d => ({
      ...d,
      resources: [
        ...d.resources,
        {
          id: `temp_${uuid()}`,
          resource_id: null,
          course_id: d.course_id,
          topic_id: null,
          title: "New resource",
          url: "",
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteResource(id: string) {
    setDraft(d => ({
      ...d,
      resources: d.resources.map(r =>
        r.id === id ? { ...r, isDeleted: true } : r
      ),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Resources"
      description="Docs, links, and reference material"
      action={
        <Button size="sm" onClick={addResource}>
          + Add resource
        </Button>
      }
    >
      {resources.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No resources added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="rounded-lg border p-4 flex items-center gap-4"
            >
              {/* ───── Fields ───── */}
              <div className="flex flex-col gap-1 flex-1">
                {/* Title */}
                <EditableField
                  value={resource.title}
                  onChange={v =>
                    updateResource(resource.id, { title: v })
                  }
                  className="text-sm font-medium"
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      onBlur={onBlur}
                    />
                  )}
                </EditableField>

                {/* URL */}
                <EditableField
                  value={resource.url || "https://"}
                  onChange={v =>
                    updateResource(resource.id, { url: v })
                  }
                  className="text-xs text-muted-foreground"
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      onBlur={onBlur}
                    />
                  )}
                </EditableField>
              </div>

              {/* ───── Actions ───── */}
              <div className="flex items-center gap-2">
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground"
                    />
                  </a>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteResource(resource.id)}
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
