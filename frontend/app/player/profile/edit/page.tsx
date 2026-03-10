import { PlayerProfileEditor } from "@/components/player-profile-editor";

export default function EditPlayerProfilePage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Edit Player Profile</h1>
        <p className="text-ink/70">Create or update the public information scouts will see.</p>
      </div>
      <PlayerProfileEditor />
    </div>
  );
}
