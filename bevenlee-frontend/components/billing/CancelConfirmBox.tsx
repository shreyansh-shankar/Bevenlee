import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  planName: string;
  expiryDateFormatted: string | null;
  loading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function CancelConfirmBox({ planName, expiryDateFormatted, loading, onConfirm, onDismiss }: Props) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium">Cancel your subscription?</p>
          <p className="text-sm text-muted-foreground">
            You'll keep access to{" "}
            <span className="font-medium text-foreground">{planName}</span>{" "}
            until{" "}
            <span className="font-medium text-foreground">{expiryDateFormatted}</span>.
            After that, your account moves to the Free plan.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onDismiss} disabled={loading}>
          Keep plan
        </Button>
        <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
          {loading ? "Cancelling..." : "Yes, cancel"}
        </Button>
      </div>
    </div>
  );
}