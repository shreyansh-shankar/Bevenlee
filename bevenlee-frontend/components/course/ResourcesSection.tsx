"use client";

import { Resource } from "@/lib/api/course";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

interface Props {
  resources: Resource[];
  onChange: (resources: Resource[]) => void;
}

export function ResourcesSection({ resources, onChange }: Props) {
  const updateResource = (
    resourceId: string,
    patch: Partial<Resource>
  ) => {
    onChange(
      resources.map((r) =>
        r.resource_id === resourceId ? { ...r, ...patch } : r
      )
    );
  };

  return (
    <CourseSection
      title="Resources"
      description="Docs, links, and reference material"
    >
      {resources.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No resources added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <div
              key={resource.resource_id}
              className="rounded-lg border p-4 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1 flex-1">
                {/* Title */}
                <EditableField
                  value={resource.title}
                  onChange={(v) =>
                    updateResource(resource.resource_id, {
                      title: v,
                    })
                  }
                  className="text-sm font-medium"
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={onBlur}
                    />
                  )}
                </EditableField>

                {/* URL */}
                <EditableField
                  value={resource.url}
                  onChange={(v) =>
                    updateResource(resource.resource_id, {
                      url: v,
                    })
                  }
                  className="text-xs text-muted-foreground"
                >
                  {({ value, onChange, onBlur }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={onBlur}
                    />
                  )}
                </EditableField>
              </div>

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
            </div>
          ))}
        </div>
      )}
    </CourseSection>
  );
}
