"use client";

import { FormEvent, useEffect, useState } from "react";

import { PlayerCard } from "@/components/player-card";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { PlayerCard as PlayerCardType } from "@/lib/types";

export function DiscoveryClient() {
  const [players, setPlayers] = useState<PlayerCardType[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadPlayers(query = "") {
    try {
      const result = await apiFetch<PlayerCardType[]>(`/players${query}`);
      setPlayers(result);
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
    <div className="grid gap-6">
      <form onSubmit={handleSearch} className="grid gap-3 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-5">
        <input name="role" placeholder="Role" />
        <input name="nationality" placeholder="Nationality" />
        <input name="preferred_foot" placeholder="Preferred foot" />
        <input name="min_age" type="number" placeholder="Min age" />
        <input name="max_age" type="number" placeholder="Max age" />
        <button type="submit" className="bg-field text-white md:col-span-5">
          Apply filters
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} href={`/scout/players/${player.id}`} />
        ))}
      </div>
    </div>
  );
}
