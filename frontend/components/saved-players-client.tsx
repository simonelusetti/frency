"use client";

import { useEffect, useState } from "react";

import { PlayerCard } from "@/components/player-card";
import { apiFetch } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import type { SavedPlayersResponse } from "@/lib/types";

export function SavedPlayersClient() {
  const [players, setPlayers] = useState<SavedPlayersResponse["players"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    if (!token || !user || user.role !== "scout") {
      return;
    }

    apiFetch<SavedPlayersResponse>("/scouts/saved", { token })
      .then((data) => setPlayers(data.players))
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load saved players");
      });
  }, []);

  if (!getStoredUser() || getStoredUser()?.role !== "scout") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a scout to view saved players.</div>;
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {players.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm">No saved players yet.</div>
      ) : (
        players.map((player) => <PlayerCard key={player.id} player={player} href={`/scout/players/${player.id}`} />)
      )}
    </div>
  );
}
