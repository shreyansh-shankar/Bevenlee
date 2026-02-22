"use client";

import { Dialog } from "@headlessui/react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Upgrade Required",
  message = "You’ve reached the limit for your current plan.",
}: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl text-center space-y-4">

          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Crown className="text-yellow-600" size={26} />
            </div>
          </div>

          <Dialog.Title className="text-xl font-semibold">
            {title}
          </Dialog.Title>

          <p className="text-sm text-muted-foreground">
            {message}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>

            <Button variant="ghost" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}