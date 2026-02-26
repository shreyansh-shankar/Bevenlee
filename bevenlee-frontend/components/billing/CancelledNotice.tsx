import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  expiryDateFormatted: string | null;
  loading: string | null;
  planId: number;
  onRenew: () => void;
}

export function CancelledNotice({ expiryDateFormatted, loading, planId, onRenew }: Props) {
  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Subscription cancelled
          </p>
          <p className="text-sm text-muted-foreground">
            Auto-renewal is off. You still have full access until{" "}
            <span className="font-medium text-foreground">{expiryDateFormatted}</span>.
            Want to continue?
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={onRenew}
          disabled={loading !== null}
          className="border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/10 text-orange-600 dark:text-orange-400"
        >
          {loading === `upgrade-${planId}` ? "Redirecting..." : "Renew plan"}
        </Button>
      </div>
    </div>
  );
}