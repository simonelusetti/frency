"use client";

import { useEffect, useState } from "react";

import { API_URL, apiFetch } from "@/lib/api";
import type { PlayerProfile } from "@/lib/types";

type PublicPlayerProfileClientProps = {
  playerId: string;
};

export function PublicPlayerProfileClient({ playerId }: PublicPlayerProfileClientProps) {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<PlayerProfile>(`/players/${playerId}`)
      .then(setPlayer)
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load player");
      });
  }, [playerId]);

  if (error) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-red-600">{error}</div>;
  }

  if (!player) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading player profile...</div>;
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{player.full_name}</h1>
            <p className="mt-2 text-sm text-ink/70">
              {player.primary_role}
              {player.secondary_role ? ` / ${player.secondary_role}` : ""} • {player.age} years old
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {player.nationality} • {player.current_team || "Independent"} • {player.preferred_foot || "Foot not set"}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/80">{player.bio || "No bio available yet."}</p>
          </div>
          <div className="rounded-2xl bg-surf p-4 text-sm text-ink/70">
            <p>Availability</p>
            <p className="mt-2 font-medium text-ink">{player.availability_status || "Not specified"}</p>
            <p className="mt-3">Height: {player.height_cm || "N/A"} cm</p>
            <p>Weight: {player.weight_kg || "N/A"} kg</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Highlights</h2>
        <div className="mt-4 grid gap-4">
          {player.videos.length === 0 ? (
            <p className="text-sm text-ink/70">No videos uploaded yet.</p>
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
