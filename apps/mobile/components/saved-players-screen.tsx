import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { ReelCard } from "@/components/reel-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { PlayerProfile } from "@/lib/types";

export function SavedPlayersScreen() {
  const { token, user } = useAuth();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    apiFetch<{ players: { id: number }[] }>("/scouts/saved", { token })
      .then(async (saved) => {
        const profiles = await Promise.all(saved.players.map((player) => apiFetch<PlayerProfile>(`/players/${player.id}`)));
        setPlayers(profiles);
      })
      .catch(() => setPlayers([]));
  }, [token]);

  if (!user || user.role !== "scout") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a scout to view saved players.</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <Text style={styles.title}>Saved players</Text>
        {players.map((player) => (
          <ReelCard key={player.id} player={player} profileHref={`/(scout)/players/${player.id}`} />
        ))}
      </MobileShell>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#f7faf6",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
});
