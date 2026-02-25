import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import ProfileContent from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex-1 px-10 py-10">
      <div className="max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    </div>
  );
}