import TopicClientPage from "@/components/course/TopicClientPage";

interface PageProps {
  params: Promise<{
    courseId: string;
    topicId: string;
  }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { topicId, courseId } = await params;

  return <TopicClientPage courseId={courseId} topicId={topicId} />;
}
