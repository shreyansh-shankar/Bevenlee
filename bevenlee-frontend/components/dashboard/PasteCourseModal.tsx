"use client";

import { Dialog } from "@headlessui/react";
import {
  X, ClipboardPaste, ChevronRight, Link,
  AlertCircle, CheckCircle2, Loader2, RotateCcw,
  FolderOpen, BookOpen,
} from "lucide-react";
import { Course } from "@/lib/api/course";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { usePasteCourse } from "@/lib/backend/usePasteCourse";
import { FORMAT_TEMPLATE, ParsedCourse } from "@/lib/backend/parseCourseFormat";

interface PasteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (course: Course) => void;
}

export function PasteCourseModal({
  isOpen,
  onClose,
  userId,
  onCreated,
}: PasteCourseModalProps) {
  const {
    step, setStep,
    raw, setRaw,
    parsed,
    parseError, setParseError,
    createError,
    showUpgrade, setShowUpgrade,
    textareaRef,
    handleClose,
    handleParse,
    handleCreate,
    loadTemplate,
  } = usePasteCourse({ isOpen, userId, onCreated, onClose });

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
          style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <ClipboardPaste size={18} className="text-accent" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold leading-tight">
                  Import Course from Text
                </Dialog.Title>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paste a structured outline to create a course with topics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 mr-3">
                {(["paste", "preview"] as const).map((s, i) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === s
                        ? "bg-accent w-4"
                        : i < ["paste", "preview"].indexOf(step)
                        ? "bg-accent/60 w-2"
                        : "bg-muted-foreground/30 w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-muted/20 transition text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* PASTE STEP */}
            {step === "paste" && (
              <div className="flex flex-col">
                <div className="px-6 pt-5 pb-3">
                  <div className="rounded-xl border border-border bg-muted/10 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Expected Format
                    </p>
                    <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
{`title: Your Course Title
type: Frontend / Backend / DSA
purpose: Why you're taking this (optional)
priority: low | medium | high

topics:
  - Topic One
    - Subtopic A
    - Subtopic B

resources:
  - title: Resource Name
    url: https://example.com

projects:
  - title: Project Name
    description: What to build

assignments:
  - title: Assignment Name
    description: What to do`}
                    </pre>
                  </div>
                </div>

                <div className="px-6 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Paste your course outline
                    </label>
                    <button
                      onClick={loadTemplate}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={11} />
                      Load example
                    </button>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={raw}
                    onChange={(e) => {
                      setRaw(e.target.value);
                      setParseError(null);
                    }}
                    placeholder={FORMAT_TEMPLATE}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground/30 leading-relaxed"
                    style={{ minHeight: "240px" }}
                    spellCheck={false}
                  />
                  {parseError && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle size={14} />
                      {parseError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PREVIEW STEP */}
            {step === "preview" && parsed && (
              <div className="px-6 py-5 flex flex-col gap-5">
                <CourseMetaPreview parsed={parsed} />
                {parsed.topics.length > 0 && <TopicsPreview parsed={parsed} />}
                {parsed.resources.length > 0 && <ResourcesPreview parsed={parsed} />}
                {parsed.projects.length > 0 && <ProjectsPreview parsed={parsed} />}
                {parsed.assignments.length > 0 && <AssignmentsPreview parsed={parsed} />}

                {createError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg px-4 py-3">
                    <AlertCircle size={14} className="shrink-0" />
                    {createError}
                  </div>
                )}
              </div>
            )}

            {/* CREATING STEP */}
            {step === "creating" && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-accent/20 flex items-center justify-center">
                  <Loader2 size={24} className="text-accent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Creating your course…</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Setting up topics, resources and more
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {step !== "creating" && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-card">
              <button
                onClick={step === "preview" ? () => setStep("paste") : handleClose}
                className="text-sm text-muted-foreground hover:text-foreground transition px-3 py-2 rounded-lg hover:bg-muted/20"
              >
                {step === "preview" ? "← Back" : "Cancel"}
              </button>

              {step === "paste" && (
                <button
                  onClick={handleParse}
                  disabled={!raw.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition"
                >
                  Preview Course
                  <ChevronRight size={15} />
                </button>
              )}

              {step === "preview" && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition"
                >
                  <CheckCircle2 size={15} />
                  Create Course
                </button>
              )}
            </div>
          )}
        </Dialog.Panel>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        message="You've reached the course limit for your current plan. Upgrade to create more courses."
      />
    </Dialog>
  );
}

// ─── Preview sub-components ───────────────────────────────────────────────────

function SectionLabel({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {children}
      </p>
      {badge && (
        <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function CourseMetaPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel>Course Details</SectionLabel>
      <div className="rounded-xl border border-border bg-muted/5 p-4 grid grid-cols-2 gap-x-6 gap-y-3">
        <MetaRow label="Title" value={parsed.title} span />
        {parsed.purpose && <MetaRow label="Purpose" value={parsed.purpose} span />}
        <MetaRow label="Type" value={parsed.type} />
        <MetaRow label="Priority" value={capitalize(parsed.priority)} />
        <MetaRow label="Projects" value={parsed.projectsEnabled ? "Enabled" : "Disabled"} />
        <MetaRow label="Assignments" value={parsed.assignmentsEnabled ? "Enabled" : "Disabled"} />
      </div>
    </div>
  );
}

function TopicsPreview({ parsed }: { parsed: ParsedCourse }) {
  const subtopicCount = parsed.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  return (
    <div>
      <SectionLabel badge={`${parsed.topics.length} topics · ${subtopicCount} subtopics`}>
        Topics & Subtopics
      </SectionLabel>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {parsed.topics.map((topic, ti) => (
          <div key={ti} className="bg-card">
            <div className="flex items-center gap-2 px-4 py-3">
              <ChevronRight size={14} className="text-accent shrink-0" />
              <span className="text-sm font-medium">{topic.title}</span>
              {topic.subtopics.length > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {topic.subtopics.length}
                </span>
              )}
            </div>
            {topic.subtopics.length > 0 && (
              <div className="pb-2 pl-10 pr-4 flex flex-col gap-1">
                {topic.subtopics.map((sub, si) => (
                  <div key={si} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    {sub.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.resources.length}`}>Resources</SectionLabel>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {parsed.resources.map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-card">
            <Link size={13} className="text-accent shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{r.title}</p>
              <p className="text-xs text-muted-foreground truncate">{r.url}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.projects.length}`}>Projects</SectionLabel>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {parsed.projects.map((p, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-card">
            <FolderOpen size={13} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              {p.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsPreview({ parsed }: { parsed: ParsedCourse }) {
  return (
    <div>
      <SectionLabel badge={`${parsed.assignments.length}`}>Assignments</SectionLabel>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {parsed.assignments.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-card">
            <BookOpen size={13} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{a.title}</p>
              {a.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MetaRow({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}