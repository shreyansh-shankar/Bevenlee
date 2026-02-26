import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInfoSection from "@/components/profile/UserInfoSection";
import BillingSection from "@/components/profile/BillingSection";
import AccountInfoSection from "@/components/profile/AccountInfoSection";
import { getUserProfile } from "@/lib/profile/getUserProfile";
import {
  normalizeSubscription,
  normalizeAccountInfo,
} from "@/lib/profile/normalizeProfile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfileContent() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) redirect("/auth/login");

  const profile = await getUserProfile(session.user.id, session.access_token);

  const userInfo = {
    id: session.user.id,
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatar_url,
  };

  const subscription = normalizeSubscription(profile.subscription);
  const accountInfo = normalizeAccountInfo(profile);

  return (
    <div className="flex-1 px-10 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <ProfileHeader />
        <UserInfoSection user={userInfo} />
        <BillingSection subscription={subscription} />
        <AccountInfoSection user={accountInfo} />
      </div>
    </div>
  );
}