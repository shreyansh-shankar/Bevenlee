import { getAuthToken } from "@/lib/auth/getAuthToken"

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

export class APIError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  }
}

export async function createCourse(payload: CreateCoursePayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new APIError(
      data?.detail?.message || "Failed to create course",
      res.status,
      data?.detail?.error
    )
  }

  return data
}

export async function getCoursesByUser(userId: string, accessToken?: string): Promise<Course[]> {
  
  const headers = accessToken
    ? { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" }
    : await authHeaders()
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${userId}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to fetch courses")
  }

  const data = await res.json()
  console.log("Dashborad fetch data: ", data)

  // backend returns { status, courses }
  return data.courses as Course[]
}

export async function updateCourseMetadata(
  courseId: string,
  updates: {
    title?: string
    type?: string
    purpose?: string
    status?: "planned" | "active" | "paused" | "completed"
    priority?: "low" | "medium" | "high"
    projects_enabled?: boolean
    assignments_enabled?: boolean
  }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${courseId}`,
    {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(updates),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to update course")
  }

  return await res.json()
}

export async function deleteCourse(courseId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${courseId}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to delete course")
  }

  return true
}

export async function getCourseDetail(
  courseId: string,
  access_token: string
): Promise<CourseDetailResponse> {
  const headers = access_token
    ? { "Authorization": `Bearer ${access_token}` }  // server call — token passed in
    : await authHeaders()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/detail/${courseId}`,
    { 
      cache: "no-store",
      headers
    }
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
    user_id: string;
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
      headers: await authHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    console.log("FULL ERROR:", error);

    throw new APIError(
      error?.detail?.message || error?.detail || "Failed to save course",
      res.status,
      error?.detail?.error
    );
  }

  return res.json();
}
