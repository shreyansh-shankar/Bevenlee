"use client";

import { v4 as uuid } from "uuid";
import { ExternalLink, Plus, Trash2 } from "lucide-react"; // Added Trash2

import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DraftResource } from "@/lib/course/draft";
import { useCourseEditor } from "./editor/CourseEditorContext";

export function ResourcesSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const resources = draft.resources.filter(r => !r.isDeleted);

  function updateResource(id: string, patch: Partial<DraftResource>) {
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
        <Button
          size="sm"
          variant="outline"
          onClick={addResource}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add resource
        </Button>
      }
    >
      {resources.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No resources added yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="flex items-center justify-between py-2 px-2 rounded transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
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
                      placeholder="Resource title"
                      className="border-none px-0 py-1 text-base focus:ring-0 focus:outline-none bg-transparent"
                    />
                  )}
                </EditableField>

                {/* URL */}
                <EditableField
                  value={resource.url || ""}
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
                      placeholder="https://"
                      className="border-none px-0 py-1 text-sm focus:ring-0 focus:outline-none bg-transparent text-muted-foreground"
                    />
                  )}
                </EditableField>
              </div>

              {/* ───── Actions ───── */}
              <div className="flex items-center gap-3"> {/* increased gap */}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    />
                  </a>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteResource(resource.id)}
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
