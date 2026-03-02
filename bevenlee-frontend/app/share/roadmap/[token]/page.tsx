import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { RoadmapSharePreviewClient } from "@/components/roadmap/share/RoadmapSharePreviewClient"

interface Props {
  params: Promise<{ token: string }>
}

async function getPreview(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/roadmap/${token}`,
    { cache: "no-store" }
  )
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const preview = await getPreview(token)
  if (!preview) return { title: "Invalid share link" }
  return {
    title: `${preview.roadmap_title} — Shared Roadmap`,
    description: `${preview.course_count} courses · shared by ${preview.created_by_name}`,
  }
}

export default async function RoadmapSharePage({ params }: Props) {
  const { token } = await params
  const preview = await getPreview(token)

  if (!preview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <h1 className="text-2xl font-bold">Link not found</h1>
        <p className="text-muted-foreground">This share link is invalid or has been removed.</p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <RoadmapSharePreviewClient
      token={token}
      preview={preview}
      isAuthenticated={!!user}
    />
  )
}