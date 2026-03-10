"use client";

import { FormEvent, useEffect, useState } from "react";

import { API_URL, apiFetch } from "@/lib/api";
import { PlayerReelCard } from "@/components/player-reel-card";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import type { PlayerProfile, SavedPlayersResponse, ScoutNote } from "@/lib/types";

type ScoutPlayerDetailClientProps = {
  playerId: string;
};

export function ScoutPlayerDetailClient({ playerId }: ScoutPlayerDetailClientProps) {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    if (!token || !user || user.role !== "scout") {
      return;
    }

    Promise.all([
      apiFetch<PlayerProfile>(`/players/${playerId}`),
      apiFetch<SavedPlayersResponse>("/scouts/saved", { token }),
      apiFetch<ScoutNote | null>(`/scouts/notes/${playerId}`, { token }).catch(() => null),
    ])
      .then(([playerData, savedData, noteData]) => {
        setPlayer(playerData);
        setSaved(savedData.players.some((savedPlayer) => savedPlayer.id === playerData.id));
        setNote(noteData?.note || "");
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load player");
      });
  }, [playerId]);

  async function handleSaveToggle() {
    const token = getStoredToken();
    if (!token) {
      setError("Login required");
      return;
    }

    try {
      if (saved) {
        await apiFetch(`/scouts/save/${playerId}`, { method: "DELETE", token });
        setSaved(false);
        setMessage("Player removed from saved list");
      } else {
        await apiFetch(`/scouts/save/${playerId}`, { method: "POST", token });
        setSaved(true);
        setMessage("Player saved");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update saved list");
    }
  }

  async function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("Login required");
      return;
    }

    try {
      await apiFetch(`/scouts/notes/${playerId}`, {
        method: "POST",
        token,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      setMessage("Private note saved");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save note");
    }
  }

  if (!getStoredUser() || getStoredUser()?.role !== "scout") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a scout to view this page.</div>;
  }

  if (error) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-red-600">{error}</div>;
  }

  if (!player) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading player...</div>;
  }

  return (
    <div className="grid gap-6">
      <PlayerReelCard
        player={player}
        video={player.videos[0] || null}
        profileHref={`/players/${player.id}`}
        primaryActionHref={`/players/${player.id}`}
        primaryActionLabel="Public profile"
        actionSlot={
          <button className="rounded-2xl border border-white/[0.18] bg-white/10 px-4 py-3 text-sm" onClick={handleSaveToggle}>
            {saved ? "Remove saved" : "Save player"}
          </button>
        }
      />

      <section className="glass-panel p-5 md:p-6">
        <h2 className="text-xl font-semibold">Private scout note</h2>
        <form onSubmit={handleNoteSubmit} className="mt-4 grid gap-4">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={6} />
          <button type="submit" className="bg-ink text-white">
            Save note
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-field">{message}</p> : null}
      </section>

      <section className="glass-panel p-5 md:p-6">
        <h2 className="text-xl font-semibold">Profile snapshot</h2>
        <div className="mt-4 grid gap-3 text-sm text-ink/[0.72] md:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4">
            <p>Nationality: {player.nationality}</p>
            <p className="mt-2">Age: {player.age}</p>
            <p className="mt-2">Preferred foot: {player.preferred_foot || "Not set"}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4">
            <p>Availability: {player.availability_status || "Not set"}</p>
            <p className="mt-2">Height: {player.height_cm || "N/A"} cm</p>
            <p className="mt-2">Weight: {player.weight_kg || "N/A"} kg</p>
          </div>
        </div>
      </section>

      {player.videos.length > 1 ? (
        <section className="glass-panel p-5 md:p-6">
          <h2 className="text-xl font-semibold">More clips</h2>
          <div className="mt-4 grid gap-4">
            {player.videos.slice(1).map((video) => (
              <div key={video.id} className="rounded-[1.5rem] bg-[#0b1320] p-3 text-white">
                <p className="font-medium">{video.title}</p>
                <p className="mt-1 text-sm text-white/[0.72]">{video.description || "No description"}</p>
                <video controls className="mt-3 w-full rounded-[1.25rem] bg-black">
                  <source src={`${API_URL}${video.file_path}`} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
