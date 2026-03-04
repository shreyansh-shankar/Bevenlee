export interface ParsedSubtopic {
  title: string;
}

export interface ParsedTopic {
  title: string;
  subtopics: ParsedSubtopic[];
}

export interface ParsedCourse {
  title: string;
  type: string;
  purpose?: string;
  status: "planned" | "active" | "paused" | "completed";
  priority: "low" | "medium" | "high";
  projectsEnabled: boolean;
  assignmentsEnabled: boolean;
  topics: ParsedTopic[];
}

export const FORMAT_TEMPLATE = `title: React Complete Guide
type: Frontend
purpose: Master React from fundamentals to advanced patterns
status: planned
priority: high

topics:
  - Introduction to React
    - What is React and why use it
    - Setting up a React project
    - JSX fundamentals
  - Components & Props
    - Functional components
    - Props and prop types
    - Component composition
  - State & Lifecycle
    - useState hook
    - useEffect hook
    - Component lifecycle
  - Advanced Patterns
    - Context API
    - Custom hooks
    - Performance optimization`;

export function parseCourseFormat(raw: string): ParsedCourse {
  const lines = raw.split("\n");
  const course: Partial<ParsedCourse> = {
    status: "planned",
    priority: "medium",
    projectsEnabled: false,
    assignmentsEnabled: false,
    topics: [],
  };

  let inTopics = false;
  let currentTopic: ParsedTopic | null = null;

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;

    if (/^topics\s*:/i.test(trimmed)) {
      inTopics = true;
      continue;
    }

    if (!inTopics) {
      const match = trimmed.match(/^(\w[\w\s]*):\s*(.+)$/);
      if (!match) continue;
      const key = match[1].trim().toLowerCase();
      const val = match[2].trim();

      if (key === "title") course.title = val;
      else if (key === "type") course.type = val;
      else if (key === "purpose") course.purpose = val;
      else if (key === "status") {
        const s = val.toLowerCase();
        if (["planned", "active", "paused", "completed"].includes(s))
          course.status = s as ParsedCourse["status"];
      } else if (key === "priority") {
        const p = val.toLowerCase();
        if (["low", "medium", "high"].includes(p))
          course.priority = p as ParsedCourse["priority"];
      }
    } else {
      const indent = line.search(/\S/);

      // Topic: 0–2 spaces of indent + dash
      if (indent <= 2 && /^\s*-\s/.test(line)) {
        const topicTitle = trimmed.replace(/^-\s+/, "").trim();
        if (currentTopic) course.topics!.push(currentTopic);
        currentTopic = { title: topicTitle, subtopics: [] };
      }
      // Subtopic: 3+ spaces of indent + dash
      else if (indent >= 3 && /^\s+-\s/.test(line)) {
        const subtopicTitle = trimmed.replace(/^-\s+/, "").trim();
        if (currentTopic) {
          currentTopic.subtopics.push({ title: subtopicTitle });
        }
      }
    }
  }

  if (currentTopic) course.topics!.push(currentTopic);

  if (!course.title) throw new Error("Missing required field: title");
  if (!course.type) throw new Error("Missing required field: type");

  return course as ParsedCourse;
}