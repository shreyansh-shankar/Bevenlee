import { formatDate } from "@/lib/profile/formatDate";
import { getProviderLabel } from "@/lib/profile/getProviderLabel";
import { UserAccountInfo } from "@/lib/types/user";

interface Props {
    user: UserAccountInfo;
}

interface InfoRowProps {
  label: string;
  value: string;
}

export default function AccountInfoSection({ user }: Props) {
  return (
    <section className="border rounded-2xl p-6 space-y-3">
      <h2 className="font-semibold text-lg">Account Information</h2>

      <InfoRow label="Email" value={user.email} />
      <InfoRow label="Provider" value={getProviderLabel(user.provider)} />
      <InfoRow label="Joined" value={formatDate(user.created_at)} />
    </section>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}