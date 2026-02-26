"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/billing";
import { createCheckout, cancelSubscription } from "@/lib/billing";
import { PlanBanner } from "./PlanBanner";
import { CancelConfirmBox } from "./CancelConfirmBox";
import { CancelledNotice } from "./CancelledNotice";
import { UpgradeSection } from "./UpgradeSection";

interface Props {
  subscription: Subscription;
  userId: string;
}

export default function CurrentPlanCard({ subscription, userId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isFree = subscription.plan_id === 0;
  const isPremium = subscription.plan_id === 2;
  const isCancelled = subscription.cancels_at_period_end;

  const expiryDateFormatted = subscription.plan_expires_at
    ? new Date(subscription.plan_expires_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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
    try {
      setLoading("cancel");
      await cancelSubscription(userId, subscription.creem_subscription_id);
      window.location.reload();
    } catch {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(null);
      setShowCancelConfirm(false);
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

      <div className="px-6 py-5 space-y-3">
        <PlanBanner
          subscription={subscription}
          expiryDateFormatted={expiryDateFormatted}
          loading={loading}
          onCancelClick={() => setShowCancelConfirm(true)}
        />

        {showCancelConfirm && (
          <CancelConfirmBox
            planName={subscription.plan_name}
            expiryDateFormatted={expiryDateFormatted}
            loading={loading === "cancel"}
            onConfirm={handleCancel}
            onDismiss={() => setShowCancelConfirm(false)}
          />
        )}

        {isCancelled && (
          <CancelledNotice
            expiryDateFormatted={expiryDateFormatted}
            loading={loading}
            planId={subscription.plan_id}
            onRenew={() => handleUpgrade(subscription.plan_id)}
          />
        )}
      </div>

      {!isPremium && !isCancelled && (
        <UpgradeSection
          currentPlanId={subscription.plan_id}
          cycle={cycle}
          loading={loading}
          onCycleChange={setCycle}
          onUpgrade={handleUpgrade}
        />
      )}

      {isPremium && !isCancelled && (
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