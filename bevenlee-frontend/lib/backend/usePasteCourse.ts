import { useState, useRef, useEffect } from "react";
import { APIError, Course, saveCourse, Topic, Subtopic } from "@/lib/api/course";
import { createCourseAction } from "@/lib/course/createCourseAction";
import { ParsedCourse, parseCourseFormat } from "./parseCourseFormat";

export type Step = "paste" | "preview" | "creating";

interface UsePasteCourseProps {
  isOpen: boolean;
  userId: string;
  onCreated: (course: Course) => void;
  onClose: () => void;
}

export function usePasteCourse({
  isOpen,
  userId,
  onCreated,
  onClose,
}: UsePasteCourseProps) {
  const [step, setStep] = useState<Step>("paste");
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedCourse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && step === "paste") {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  const reset = () => {
    setStep("paste");
    setRaw("");
    setParsed(null);
    setParseError(null);
    setCreateError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleParse = () => {
    setParseError(null);
    try {
      const result = parseCourseFormat(raw);
      setParsed(result);
      setStep("preview");
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Invalid format");
    }
  };

  const handleCreate = async () => {
    if (!parsed) return;
    setStep("creating");
    setCreateError(null);

    try {
      // 1. Create the course shell — response shape: { status, course: { course_id, ... } }
      const data = await createCourseAction({
        userId,
        title: parsed.title,
        purpose: parsed.purpose,
        type: parsed.type,
        status: parsed.status,
        priority: parsed.priority,
        projectsEnabled: parsed.projectsEnabled,
        assignmentsEnabled: parsed.assignmentsEnabled,
      });

      // Safely extract course_id — log the full response to catch mismatches
      console.log("[PasteCourse] createCourseAction response:", data);

      // Backend returns { status, course: [...] } — course is an array
      const courseObj = Array.isArray(data?.course) ? data.course[0] : data?.course;
      const courseId: string = courseObj?.course_id;

      if (!courseId) {
        throw new Error(
          `Could not extract course_id from response: ${JSON.stringify(data)}`
        );
      }

      // 2. Build topics payload — strip any leading dashes from titles
      const topics: Topic[] = parsed.topics.map((t, ti) => ({
        topic_id: null,
        title: t.title.replace(/^-\s*/, "").trim(),
        status: "not_started",
        position: ti,
        subtopics: t.subtopics.map((s, si) => ({
          subtopic_id: null,
          title: s.title.replace(/^-\s*/, "").trim(),
          is_completed: false,
          position: si,
        })) as unknown as Subtopic[],
      }));

      // 3. Save course with topics (only if there are topics to save)
      if (topics.length > 0) {
        await saveCourse(courseId, {
          user_id: userId,
          course_id: courseId,
          course: {
            title: parsed.title,
            type: parsed.type,
            status: parsed.status,
            priority: parsed.priority,
            purpose: parsed.purpose ?? null,
            projects_enabled: parsed.projectsEnabled,
            assignments_enabled: parsed.assignmentsEnabled,
          },
          topics,
          resources: [],
          projects: [],
          assignments: [],
        });
      }

      reset();
      onCreated(courseObj);
      onClose();
    } catch (err: unknown) {
      console.error("[PasteCourse] handleCreate error:", err);
      if (err instanceof APIError) {
        if (err.code === "PLAN_LIMIT_EXCEEDED") {
          setShowUpgrade(true);
          setStep("preview");
          return;
        }
        setCreateError(err.message);
      } else if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError("Something went wrong. Please try again.");
      }
      setStep("preview");
    }
  };

  const loadTemplate = () => {
    setRaw(
      `title: React Complete Guide\ntype: Frontend\npurpose: Master React from fundamentals to advanced patterns\nstatus: planned\npriority: high\n\ntopics:\n  - Introduction to React\n    - What is React and why use it\n    - Setting up a React project\n  - Components & Props\n    - Functional components\n    - Props and prop types`
    );
    setParseError(null);
  };

  return {
    step,
    setStep,
    raw,
    setRaw,
    parsed,
    parseError,
    setParseError,
    createError,
    showUpgrade,
    setShowUpgrade,
    textareaRef,
    handleClose,
    handleParse,
    handleCreate,
    loadTemplate,
  };
}