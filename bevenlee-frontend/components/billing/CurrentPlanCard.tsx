"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/lib/billing";
import { createCheckout, cancelSubscription } from "@/lib/billing";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

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
        badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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
        badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        recommended: true,
    },
];

interface Props {
    subscription: Subscription;
    userId: string;
}

export default function CurrentPlanCard({ subscription, userId }: Props) {
    const [loading, setLoading] = useState<string | null>(null);
    const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

    const isFree = subscription.plan_id === 0;
    const isPro = subscription.plan_id === 1;
    const isPremium = subscription.plan_id === 2;

    const visiblePlans = PLANS.filter((p) => p.id > subscription.plan_id);

    async function handleUpgrade(planId: number) {
        try {
            setLoading(`upgrade-${planId}`);
            const url = await createCheckout(userId, planId, cycle);
            window.location.href = url;
        } catch {
            alert("Failed to start checkout. Please try again.");
        } finally {
            setLoading(null);
        }
    }

    async function handleCancel() {
        if (!subscription.creem_subscription_id) return;
        if (!confirm("Are you sure you want to cancel your subscription?")) return;
        try {
            setLoading("cancel");
            await cancelSubscription(userId, subscription.creem_subscription_id);
            window.location.reload();
        } catch {
            alert("Failed to cancel subscription. Please try again.");
        } finally {
            setLoading(null);
        }
    }

    return (
        <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b">
                <h2 className="text-lg font-semibold">Subscription</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Manage your plan and billing.
                </p>
            </div>

            {/* Current Plan Banner */}
            <div className="px-6 py-5">
                <div
                    className={`rounded-xl p-5 flex items-center justify-between gap-4
            ${isPremium ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20" :
                            isPro ? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20" :
                                "bg-muted/50 border"}`}
                >
                    <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            {isPremium && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                            {isPro && <Zap className="w-4 h-4 text-blue-500 shrink-0" />}
                            {isFree && <Sparkles className="w-4 h-4 text-muted-foreground shrink-0" />}
                            <span className="font-semibold text-base">{subscription.plan_name} Plan</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${isFree ? "bg-muted text-muted-foreground" :
                                    subscription.is_active ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                        "bg-red-500/10 text-red-500"}`}>
                                {isFree ? "Free" : subscription.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {!isFree && subscription.plan_expires_at && (
                            <p className="text-sm text-muted-foreground">
                                {subscription.days_remaining !== null && (
                                    <span className="font-medium text-foreground">{subscription.days_remaining} days left</span>
                                )}
                                {subscription.days_remaining !== null && " · "}
                                Renews {new Date(subscription.plan_expires_at).toLocaleDateString("en-US", {
                                    month: "long", day: "numeric", year: "numeric"
                                })}
                            </p>
                        )}

                        {isFree && (
                            <p className="text-sm text-muted-foreground">
                                3 courses · 7 topics per course
                            </p>
                        )}
                    </div>

                    {!isFree && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancel}
                            disabled={loading === "cancel"}
                            className="shrink-0"
                        >
                            {loading === "cancel" ? "Canceling..." : "Cancel"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Upgrade Section */}
            {!isPremium && (
                <div className="px-6 pb-6 space-y-4">
                    {/* Divider + label */}
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
                                onClick={() => setCycle("monthly")}
                                className={`px-4 py-1.5 rounded-md font-medium transition-all ${cycle === "monthly"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setCycle("yearly")}
                                className={`px-4 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${cycle === "yearly"
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
                    <div className={`grid gap-4 ${visiblePlans.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
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

                                    <div className="flex items-start justify-between">
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
                                        onClick={() => handleUpgrade(plan.id)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Redirecting..." : `Get ${plan.name}`}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Already on Premium */}
            {isPremium && (
                <div className="px-6 pb-6">
                    <div className="rounded-xl bg-muted/30 border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            You're on our highest tier. Enjoy all features! 🎉
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}