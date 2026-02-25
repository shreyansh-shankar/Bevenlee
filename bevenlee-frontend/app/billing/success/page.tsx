import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="max-w-md w-full text-center space-y-4 rounded-2xl border bg-card p-10 shadow-sm">
          <div className="text-4xl">🎉</div>
          <h1 className="text-2xl font-semibold">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Your plan has been activated. It may take a few seconds to reflect.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild>
              <Link href="/billing">View Billing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}