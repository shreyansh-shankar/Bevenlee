import { APIError, Course, saveCourse, Topic, Subtopic, Resource, Project, Assignment } from "@/lib/api/course";
import { createCourseAction } from "@/lib/course/createCourseAction";
import { ParsedCourse } from "./parseCourseFormat";

/**
 * Creates a course shell then saves the full aggregate
 * (topics, resources, projects, assignments) in one go.
 *
 * Default statuses — always forced regardless of what was in the pasted format:
 *   course      → status from parsed (user controls this), falls back to "planned"
 *   topics      → "not_started"
 *   subtopics   → is_completed: false
 *   projects    → "planned"
 *   assignments → "planned"
 */
export async function createCourseFromParsed(
  userId: string,
  parsed: ParsedCourse
): Promise<Course> {

  // 1. Create course shell
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

  // Backend returns { status, course: [...] }
  const courseObj = Array.isArray(data?.course) ? data.course[0] : data?.course;
  const courseId: string = courseObj?.course_id;

  if (!courseId) {
    throw new Error(
      `Could not extract course_id from response: ${JSON.stringify(data)}`
    );
  }

  // 2. Topics — always "not_started", subtopics always is_completed: false
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

  // 3. Resources
  const resources: Resource[] = parsed.resources.map((r) => ({
    resource_id: null,
    course_id: courseId,
    topic_id: null,
    title: r.title,
    url: r.url,
  }));

  // 4. Projects — always "planned"
  const projects: Project[] = parsed.projects.map((p) => ({
    project_id: null,
    course_id: courseId,
    title: p.title,
    status: "planned",
    description: p.description ?? null,
  }));

  // 5. Assignments — always "planned"
  const assignments: Assignment[] = parsed.assignments.map((a) => ({
    assignment_id: null,
    course_id: courseId,
    title: a.title,
    status: "planned",
    description: a.description ?? null,
  }));

  // 6. Save full aggregate
  const hasContent =
    topics.length > 0 ||
    resources.length > 0 ||
    projects.length > 0 ||
    assignments.length > 0;

  if (hasContent) {
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
      resources,
      projects,
      assignments,
    });
  }

  return courseObj as Course;
}