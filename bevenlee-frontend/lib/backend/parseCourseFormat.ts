// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParsedSubtopic {
  title: string;
}

export interface ParsedTopic {
  title: string;
  subtopics: ParsedSubtopic[];
}

export interface ParsedResource {
  title: string;
  url: string;
  topic?: string;
}

export interface ParsedProject {
  title: string;
  status: string;
  description?: string;
}

export interface ParsedAssignment {
  title: string;
  status: string;
  description?: string;
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
  resources: ParsedResource[];
  projects: ParsedProject[];
  assignments: ParsedAssignment[];
}

// ─── Template ─────────────────────────────────────────────────────────────────

export const FORMAT_TEMPLATE = `title: React Complete Guide
type: Frontend
purpose: Master React from fundamentals to advanced patterns
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

resources:
  - title: React Official Docs
    url: https://react.dev
  - title: React Patterns
    url: https://reactpatterns.com

projects:
  - title: Todo App
    description: Build a full CRUD todo app using React state

assignments:
  - title: JSX Exercises
    description: Complete 10 JSX transformation exercises`;

// ─── Parser ───────────────────────────────────────────────────────────────────

type Section = "meta" | "topics" | "resources" | "projects" | "assignments";

export function parseCourseFormat(raw: string): ParsedCourse {
  const lines = raw.split("\n");

  const course: Partial<ParsedCourse> = {
    status: "planned",
    priority: "medium",
    projectsEnabled: false,
    assignmentsEnabled: false,
    topics: [],
    resources: [],
    projects: [],
    assignments: [],
  };

  let section: Section = "meta";
  let currentTopic: ParsedTopic | null = null;
  let currentBlock: Record<string, string> | null = null;

  const flushTopic = () => {
    if (currentTopic) { course.topics!.push(currentTopic); currentTopic = null; }
  };

  const flushBlock = () => {
    if (!currentBlock) return;
    if (section === "resources" && currentBlock.title && currentBlock.url) {
      course.resources!.push({
        title: currentBlock.title,
        url: currentBlock.url,
        ...(currentBlock.topic ? { topic: currentBlock.topic } : {}),
      });
    } else if (section === "projects" && currentBlock.title) {
      course.projects!.push({
        title: currentBlock.title,
        status: "planned",
        ...(currentBlock.description ? { description: currentBlock.description } : {}),
      });
      course.projectsEnabled = true;
    } else if (section === "assignments" && currentBlock.title) {
      course.assignments!.push({
        title: currentBlock.title,
        status: "planned",
        ...(currentBlock.description ? { description: currentBlock.description } : {}),
      });
      course.assignmentsEnabled = true;
    }
    currentBlock = null;
  };

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;

    // ── Section headers ──
    if (/^topics\s*:/i.test(trimmed))      { flushTopic(); flushBlock(); section = "topics";      continue; }
    if (/^resources\s*:/i.test(trimmed))   { flushTopic(); flushBlock(); section = "resources";   continue; }
    if (/^projects\s*:/i.test(trimmed))    { flushTopic(); flushBlock(); section = "projects";    continue; }
    if (/^assignments\s*:/i.test(trimmed)) { flushTopic(); flushBlock(); section = "assignments"; continue; }

    // ── Meta ──
    if (section === "meta") {
      const match = trimmed.match(/^(\w[\w\s]*):\s*(.+)$/);
      if (!match) continue;
      const key = match[1].trim().toLowerCase();
      const val = match[2].trim();
      if (key === "title") course.title = val;
      else if (key === "type") course.type = val;
      else if (key === "purpose") course.purpose = val;
      else if (key === "priority") {
        const p = val.toLowerCase();
        if (["low", "medium", "high"].includes(p))
          course.priority = p as ParsedCourse["priority"];
      }
      continue;
    }

    // ── Topics ──
    if (section === "topics") {
      const indent = line.search(/\S/);
      if (indent <= 2 && /^\s*-\s/.test(line)) {
        flushTopic();
        currentTopic = { title: trimmed.replace(/^-\s+/, "").trim(), subtopics: [] };
      } else if (indent >= 3 && /^\s+-\s/.test(line)) {
        currentTopic?.subtopics.push({ title: trimmed.replace(/^-\s+/, "").trim() });
      }
      continue;
    }

    // ── Resources / Projects / Assignments ──
    // New block: line like "  - title: Something"
    if (/^\s*-\s+title\s*:/i.test(line)) {
      flushBlock();
      currentBlock = { title: line.replace(/^\s*-\s+title\s*:\s*/i, "").trim() };
      continue;
    }

    // Continuation fields inside a block
    if (currentBlock) {
      const fullyTrimmed = trimmed.trim();
      const kv = fullyTrimmed.match(/^(\w[\w\s]*?)\s*:\s*(.*)$/);
      if (kv) {
        const key = kv[1].trim().toLowerCase();
        if (key === "url") {
          const urlMatch = fullyTrimmed.match(/^url\s*:\s*(.+)$/i);
          currentBlock["url"] = urlMatch ? urlMatch[1].trim() : kv[2].trim();
        } else {
          currentBlock[key] = kv[2].trim();
        }
      }
    }
  }

  flushTopic();
  flushBlock();

  if (!course.title) throw new Error("Missing required field: title");
  if (!course.type)  throw new Error("Missing required field: type");

  return course as ParsedCourse;
}