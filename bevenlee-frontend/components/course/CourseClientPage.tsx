"use client";

import { useState } from "react";
import { CourseLayout } from "./CourseLayout";
import { CourseHeader } from "./CourseHeader";
import { TopicsSection } from "./TopicsSection";
import { ResourcesSection } from "./ResourcesSection";
import { ProjectsSection } from "./ProjectsSection";
import { AssignmentsSection } from "./AssignmentsSection";
import { Button } from "@/components/ui/button";

export function CourseClientPage({
    course,
    topics,
    resources,
    projects,
    assignments,
}: any) {
    const [courseState, setCourseState] = useState(course);
    const [isDirty, setIsDirty] = useState(false);

    return (
        <CourseLayout>
            {/* ───────────────── Header + Save (merged) ───────────────── */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
                <div className="flex items-start justify-between gap-8 px-8 py-6">
                    {/* LEFT: Header */}
                    <div className="flex-1">
                        <CourseHeader
                            course={courseState}
                            onChange={(updated: any) => {
                                setCourseState(updated);
                                setIsDirty(true);
                            }}
                        />
                    </div>

                    {/* RIGHT: Save */}
                    <div className="shrink-0 pt-2">
                        <Button
                            disabled={!isDirty}
                            size="sm"
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>

            {/* ───────────────── Workspace ───────────────── */}
            <div className="grid grid-cols-12 gap-10 px-8 pb-16">
                {/* LEFT: PRIMARY WORK AREA */}
                <div className="col-span-8 flex flex-col gap-10">
                    <TopicsSection
                        topics={topics}
                        onChange={() => setIsDirty(true)}
                    />

                    <ResourcesSection
                        resources={resources}
                        onChange={() => setIsDirty(true)}
                    />
                </div>

                {/* RIGHT: CONTEXT SIDEBAR */}
                <div className="col-span-4 flex flex-col gap-6">
                    {courseState.assignments_enabled && (
                        <AssignmentsSection
                            assignments={assignments}
                            onChange={() => setIsDirty(true)}
                        />
                    )}

                    {courseState.projects_enabled && (
                        <ProjectsSection
                            projects={projects}
                            onChange={() => setIsDirty(true)}
                        />
                    )}
                </div>
            </div>
        </CourseLayout>
    );
}
