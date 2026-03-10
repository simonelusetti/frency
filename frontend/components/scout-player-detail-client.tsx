"use client";

import { FormEvent, useEffect, useState } from "react";

import { API_URL, apiFetch } from "@/lib/api";
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
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{player.full_name}</h1>
            <p className="mt-2 text-sm text-ink/70">
              {player.primary_role}
              {player.secondary_role ? ` / ${player.secondary_role}` : ""} • {player.current_team || "No team listed"}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {player.nationality} • {player.age} • {player.preferred_foot || "Foot not set"}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/80">{player.bio || "No bio available."}</p>
          </div>
          <button className="bg-field px-4 py-3 text-white" onClick={handleSaveToggle}>
            {saved ? "Remove from saved" : "Save player"}
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Private scout note</h2>
        <form onSubmit={handleNoteSubmit} className="mt-4 grid gap-4">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={6} />
          <button type="submit" className="bg-ink text-white">
            Save note
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-field">{message}</p> : null}
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Highlight videos</h2>
        <div className="mt-4 grid gap-4">
          {player.videos.length === 0 ? (
            <p className="text-sm text-ink/70">No public videos uploaded yet.</p>
          ) : (
            player.videos.map((video) => (
              <div key={video.id} className="rounded-2xl border border-ink/10 p-4">
                <p className="font-medium">{video.title}</p>
                <p className="mt-1 text-sm text-ink/70">{video.description || "No description"}</p>
                <video controls className="mt-4 w-full rounded-2xl bg-black">
                  <source src={`${API_URL}${video.file_path}`} type="video/mp4" />
                </video>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
