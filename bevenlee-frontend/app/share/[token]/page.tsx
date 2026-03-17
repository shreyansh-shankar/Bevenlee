export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SharePreviewClient } from "@/components/course/share/SharePreviewClient"

interface Props {
  params: Promise<{ token: string }>
}

async function getPreview(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/${token}`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const preview = await getPreview(token)
  if (!preview) {
    return { title: "Invalid share link" }
  }
  return {
    title: `${preview.course_title} — Shared Course`,
    description: `${preview.topic_count} topics · shared by ${preview.created_by_name}`,
  }
}

export default async function SharePage({ params }: Props) {
  const { token } = await params
  const preview = await getPreview(token)

  if (!preview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <h1 className="text-2xl font-bold">Link not found</h1>
        <p className="text-muted-foreground">
          This share link is invalid or has been removed.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <SharePreviewClient
      token={token}
      preview={preview}
      isAuthenticated={!!user}
    />
  )
}