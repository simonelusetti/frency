"use client";

import { useEffect, useState } from "react";

import { API_URL, apiFetch } from "@/lib/api";
import { PlayerReelCard } from "@/components/player-reel-card";
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
      <PlayerReelCard
        player={player}
        profileHref={`/players/${player.id}`}
        primaryActionHref={player.videos[0] ? `${API_URL}${player.videos[0].file_path}` : undefined}
        primaryActionLabel={player.videos[0] ? "Open raw clip" : undefined}
        video={player.videos[0] || null}
      />

      <section className="glass-panel p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-3 text-sm leading-7 text-ink/[0.78]">{player.bio || "No bio available yet."}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-ink/[0.72]">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/[0.45]">Profile facts</p>
            <div className="mt-3 grid gap-2">
              <p>Availability: {player.availability_status || "Not specified"}</p>
              <p>Height: {player.height_cm || "N/A"} cm</p>
              <p>Weight: {player.weight_kg || "N/A"} kg</p>
              <p>Club: {player.current_team || "Independent"}</p>
            </div>
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
