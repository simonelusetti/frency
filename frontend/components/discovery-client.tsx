"use client";

import { FormEvent, useEffect, useState } from "react";

import { PlayerReelCard } from "@/components/player-reel-card";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { PlayerCard as PlayerCardType, PlayerProfile } from "@/lib/types";

export function DiscoveryClient() {
  const [players, setPlayers] = useState<PlayerCardType[]>([]);
  const [profilesById, setProfilesById] = useState<Record<number, PlayerProfile>>({});
  const [error, setError] = useState<string | null>(null);

  async function loadPlayers(query = "") {
    try {
      const result = await apiFetch<PlayerCardType[]>(`/players${query}`);
      setPlayers(result);
      const profiles = await Promise.all(
        result.map(async (player) => {
          try {
            return await apiFetch<PlayerProfile>(`/players/${player.id}`);
          } catch {
            return null;
          }
        }),
      );
      setProfilesById(
        profiles.reduce<Record<number, PlayerProfile>>((accumulator, profile) => {
          if (profile) {
            accumulator[profile.id] = profile;
          }
          return accumulator;
        }, {}),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load players");
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of ["role", "nationality", "preferred_foot", "min_age", "max_age"]) {
      const value = String(form.get(key) || "").trim();
      if (value) {
        params.set(key, value);
      }
    }

    setError(null);
    await loadPlayers(params.toString() ? `?${params.toString()}` : "");
  }

  if (!getStoredUser() || getStoredUser()?.role !== "scout") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a scout to use discovery.</div>;
  }

  return (
    <div className="grid gap-5">
      <section className="glass-panel sticky top-3 z-20 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Discovery feed</h2>
            <p className="text-sm text-ink/[0.60]">Filter lightly, then review players clip-first.</p>
          </div>
          <span className="rounded-full bg-field/10 px-3 py-1 text-xs text-field">{players.length} players</span>
        </div>
        <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-5">
          <input name="role" placeholder="Role" />
          <input name="nationality" placeholder="Nationality" />
          <input name="preferred_foot" placeholder="Preferred foot" />
          <input name="min_age" type="number" placeholder="Min age" />
          <input name="max_age" type="number" placeholder="Max age" />
          <button type="submit" className="bg-field text-white md:col-span-5">
            Refresh feed
          </button>
        </form>
      </section>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-5">
        {players.map((player) => (
          <PlayerReelCard
            key={player.id}
            player={{
              ...player,
              bio: profilesById[player.id]?.bio || player.bio,
            }}
            video={profilesById[player.id]?.videos?.[0] || null}
            profileHref={`/scout/players/${player.id}`}
            primaryActionHref={`/players/${player.id}`}
            primaryActionLabel="Public profile"
          />
        ))}
      </div>
    </div>
  );
}
