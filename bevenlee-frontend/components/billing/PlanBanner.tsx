import { Button } from "@/components/ui/button";
import type { Subscription } from "@/lib/billing";
import { Crown, Zap, Sparkles, Calendar } from "lucide-react";

interface Props {
  subscription: Subscription;
  expiryDateFormatted: string | null;
  loading: string | null;
  onCancelClick: () => void;
}

export function PlanBanner({ subscription, expiryDateFormatted, loading, onCancelClick }: Props) {
  const isFree = subscription.plan_id === 0;
  const isPro = subscription.plan_id === 1;
  const isPremium = subscription.plan_id === 2;
  const isCancelled = subscription.cancels_at_period_end;

  return (
    <div
      className={`rounded-xl p-5 flex items-center justify-between gap-4
        ${isPremium
          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
          : isPro
          ? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20"
          : "bg-muted/50 border"
        }`}
    >
      <div className="space-y-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isPremium && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
          {isPro && <Zap className="w-4 h-4 text-blue-500 shrink-0" />}
          {isFree && <Sparkles className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="font-semibold text-base">{subscription.plan_name} Plan</span>

          {isFree && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
              Free
            </span>
          )}
          {!isFree && !isCancelled && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600 dark:text-green-400">
              Active
            </span>
          )}
          {isCancelled && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400">
              Cancels {expiryDateFormatted}
            </span>
          )}
        </div>

        {!isFree && subscription.plan_expires_at && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {isCancelled ? (
              <>
                Access until{" "}
                <span className="font-medium text-foreground">{expiryDateFormatted}</span>
                {subscription.days_remaining !== null && (
                  <span className="text-orange-500 dark:text-orange-400">
                    · {subscription.days_remaining} days left
                  </span>
                )}
              </>
            ) : (
              <>
                {subscription.days_remaining !== null && (
                  <span className="font-medium text-foreground">
                    {subscription.days_remaining} days left
                  </span>
                )}
                {subscription.days_remaining !== null && " · "}
                Renews {expiryDateFormatted}
              </>
            )}
          </p>
        )}

        {isFree && (
          <p className="text-sm text-muted-foreground">
            3 courses · 7 topics per course
          </p>
        )}
      </div>

      {!isFree && !isCancelled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelClick}
          disabled={loading === "cancel"}
          className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
        >
          Cancel plan
        </Button>
      )}
    </div>
  );
}