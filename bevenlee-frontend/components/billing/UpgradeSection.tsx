import { Button } from "@/components/ui/button";
import { Check, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    id: 1,
    name: "Pro",
    icon: Zap,
    monthlyPrice: "$8.99",
    yearlyPrice: "$89.99",
    monthlyLabel: "/mo",
    yearlyLabel: "/yr",
    features: ["10 courses", "12 topics per course", "Priority support"],
    accent: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    name: "Premium",
    icon: Crown,
    monthlyPrice: "$14.99",
    yearlyPrice: "$149.99",
    monthlyLabel: "/mo",
    yearlyLabel: "/yr",
    features: ["Unlimited courses", "Unlimited topics", "Priority support", "Early access to features"],
    accent: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-500",
    recommended: true,
  },
];

interface Props {
  currentPlanId: number;
  cycle: "monthly" | "yearly";
  loading: string | null;
  onCycleChange: (cycle: "monthly" | "yearly") => void;
  onUpgrade: (planId: number) => void;
}

export function UpgradeSection({ currentPlanId, cycle, loading, onCycleChange, onUpgrade }: Props) {
  const visiblePlans = PLANS.filter((p) => p.id > currentPlanId);

  return (
    <div className="px-6 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Upgrade
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-0.5 rounded-lg border bg-muted/50 p-1 text-sm">
          <button
            onClick={() => onCycleChange("monthly")}
            className={`px-4 py-1.5 rounded-md font-medium transition-all ${
              cycle === "monthly"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onCycleChange("yearly")}
            className={`px-4 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              cycle === "yearly"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 font-semibold">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div
        className={`grid gap-4 ${
          visiblePlans.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {visiblePlans.map((plan) => {
          const Icon = plan.icon;
          const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const period = cycle === "monthly" ? plan.monthlyLabel : plan.yearlyLabel;
          const isLoading = loading === `upgrade-${plan.id}`;

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-5 space-y-4 bg-gradient-to-br transition-all hover:shadow-md
                ${plan.recommended ? plan.accent + " " + plan.border : "hover:border-border/80"}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500 text-white font-semibold shadow-sm whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${plan.iconColor}`} />
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight">{price}</span>
                  <span className="text-sm text-muted-foreground">{period}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className={`w-3.5 h-3.5 shrink-0 ${plan.iconColor}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.recommended ? "default" : "outline"}
                onClick={() => onUpgrade(plan.id)}
                disabled={isLoading}
              >
                {isLoading ? "Redirecting..." : `Get ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}