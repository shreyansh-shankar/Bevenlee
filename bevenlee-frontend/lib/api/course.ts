export interface CreateCoursePayload {
  user_id: string
  title: string
  purpose?: string
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  projects_enabled: boolean
  assignments_enabled: boolean
}

export interface Course {
  course_id: string
  user_id: string
  title: string
  purpose?: string | null
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
}

export interface Subtopic {
  subtopic_id: string | null
  topic_id: string
  title: string
  is_completed: boolean
  position: number
}

export interface Topic {
  topic_id: string | null
  title: string
  status: string
  position: number
  subtopics: Subtopic[]
}

export interface Resource {
  resource_id: string | null
  course_id: string | null
  topic_id: string | null
  title: string
  url: string
}

export interface Project {
  project_id: string | null
  course_id: string
  title: string
  status: string
  description: string | null
}

export interface Assignment {
  assignment_id: string | null
  course_id: string
  title: string
  status: string
  description: string | null
}

export interface CourseDetail {
  course_id: string
  title: string
  purpose?: string | null
  type: string
  status: "planned" | "active" | "paused" | "completed"
  priority: "low" | "medium" | "high"
  projects_enabled: boolean
  assignments_enabled: boolean
}

export interface CourseDetailResponse {
  course: CourseDetail
  topics: Topic[]
  resources: Resource[]
  projects: Project[]
  assignments: Assignment[]
}

export async function createCourse(payload: CreateCoursePayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to create course")
  }

  return res.json()
}

export async function getCoursesByUser(userId: string): Promise<Course[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to fetch courses")
  }

  const data = await res.json()

  // backend returns { status, courses }
  return data.courses as Course[]
}

export async function getCourseDetail(
  courseId: string
): Promise<CourseDetailResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/detail/${courseId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch course detail");
  }

  const data = await res.json();
  const payload = data.course;

  return {
    course: payload.course,
    topics: payload.topics ?? [],
    resources: payload.resources ?? [],
    projects: payload.projects ?? [],
    assignments: payload.assignments ?? [],
  };
}

  // ─────────────────────────────────────────────
  // Save / Update full course aggregate
  // ─────────────────────────────────────────────

  export async function saveCourse(
    courseId: string,
    payload: {
      course_id: string;
      course: {
        title: string;
        type: string;
        status: string;
        priority: string;
        purpose?: string | null;
        projects_enabled: boolean;
        assignments_enabled: boolean;
      };
      topics: Topic[];
      resources: Resource[];
      projects: Project[];
      assignments: Assignment[];
    }
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/save/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to save course");
    }

    return res.json();
  }
