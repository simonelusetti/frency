import { SavedPlayersClient } from "@/components/saved-players-client";

export default function ScoutSavedPlayersPage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Saved Players</h1>
        <p className="text-ink/70">Return to prospects you want to track more closely.</p>
      </div>
      <SavedPlayersClient />
    </div>
  );
}
