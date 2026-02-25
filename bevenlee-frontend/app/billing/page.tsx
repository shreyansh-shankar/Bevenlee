import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import BillingContent from "@/components/billing/BillingContent";

export default function BillingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<BillingSkeleton />}>
        <BillingContent />
      </Suspense>
    </div>
  );
}

function BillingSkeleton() {
  return (
    <div className="flex-1 px-10 py-10">
      <div className="max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    </div>
  );
}