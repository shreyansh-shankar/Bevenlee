"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UpgradeModal } from "@/components/subscription/UpgradeModal"

export default function RoadmapsUpgradePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  function handleClose() {
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <UpgradeModal
      isOpen={open}
      onClose={handleClose}
      title="Pro Feature"
      message="Roadmaps are available on the Pro plan and above. Upgrade to create structured learning paths."
    />
  )
}