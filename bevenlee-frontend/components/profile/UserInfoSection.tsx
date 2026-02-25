"use client";

import { useState } from "react";
import AvatarPicker from "./AvatarPicker";
import type { UserProfile } from "@/lib/types/user";
import { Button } from "../ui/button";
import { updateUserProfile } from "@/lib/profile/getUserProfile";

interface Props {
  user: UserProfile;
}

export default function UserInfoSection({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await updateUserProfile(user.id, name);

      // update original value to prevent button staying enabled
      user.name = name;

    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-semibold">User Info</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile details.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* avatar UI stays */}
        <AvatarPicker
          name={name}
          avatarUrl={user.avatar_url}
        />

        <div className="flex-1 space-y-3 max-w-sm">
          <div className="space-y-1">
            <label className="text-sm font-medium">Display Name</label>

            <input
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || name === user.name}
            className="text-sm font-medium hover:disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </section>
  );
}