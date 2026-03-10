import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { ReelCard } from "@/components/reel-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { PlayerCard, PlayerProfile } from "@/lib/types";

export function ScoutDiscoveryScreen() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    Promise.resolve()
      .then(async () => {
        const cards = await apiFetch<PlayerCard[]>("/players");
        const profiles = await Promise.all(cards.map((player) => apiFetch<PlayerProfile>(`/players/${player.id}`)));
        setPlayers(profiles);
      })
      .catch(() => setPlayers([]));
  }, []);

  if (!user || user.role !== "scout") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a scout to access the discovery feed.</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <View style={styles.header}>
          <Text style={styles.title}>Scout feed</Text>
          <Text style={styles.copy}>Review player clips and open details in a native mobile flow.</Text>
        </View>
        {players.map((player) => (
          <ReelCard key={player.id} player={player} profileHref={`/(scout)/players/${player.id}`} />
        ))}
      </MobileShell>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 4,
  },
  title: {
    color: "#f7faf6",
    fontSize: 34,
    fontWeight: "800",
  },
  copy: {
    color: "rgba(247,250,246,0.72)",
    fontSize: 15,
  },
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
});
