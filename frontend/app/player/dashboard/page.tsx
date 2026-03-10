import { PlayerDashboardClient } from "@/components/player-dashboard-client";

export default function PlayerDashboardPage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Player Dashboard</h1>
        <p className="text-ink/70">Manage your profile, videos, and private documents.</p>
      </div>
      <PlayerDashboardClient />
    </div>
  );
}
