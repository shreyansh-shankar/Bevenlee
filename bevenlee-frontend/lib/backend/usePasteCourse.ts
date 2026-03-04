import { useState, useRef, useEffect } from "react";
import { APIError, Course } from "@/lib/api/course";
import { ParsedCourse, parseCourseFormat } from "./parseCourseFormat";
import { createCourseFromParsed } from "./createCourseFromParsed";

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
      const course = await createCourseFromParsed(userId, parsed);
      reset();
      onCreated(course);
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
      `title: React Complete Guide\ntype: Frontend\npurpose: Master React from fundamentals to advanced patterns\npriority: high\n\ntopics:\n  - Introduction to React\n    - What is React and why use it\n    - Setting up a React project\n  - Components & Props\n    - Functional components\n    - Props and prop types\n\nresources:\n  - title: React Official Docs\n    url: https://react.dev\n\nprojects:\n  - title: Todo App\n    description: Build a full CRUD todo app\n\nassignments:\n  - title: JSX Exercises\n    description: Complete 10 JSX transformation exercises`
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