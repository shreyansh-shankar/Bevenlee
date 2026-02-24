import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInfoSection from "@/components/profile/UserInfoSection";
import BillingSection from "@/components/profile/BillingSection";
import AccountInfoSection from "@/components/profile/AccountInfoSection";

import { getUserProfile } from "@/lib/profile/getUserProfile";
import {
    normalizeSubscription,
    normalizeAccountInfo,
} from "@/lib/profile/normalizeProfile";
import { Navbar } from "@/components/Navbar";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  const userInfo = {
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatar_url,
  };

  const subscription = normalizeSubscription(
    profile.subscription
  );

  const accountInfo = normalizeAccountInfo(profile);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <div className="flex-1 px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <ProfileHeader />

          <UserInfoSection user={userInfo} />

          <BillingSection subscription={subscription} />

          <AccountInfoSection user={accountInfo} />
        </div>
      </div>
    </div>
  );
}