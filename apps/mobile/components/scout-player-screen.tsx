import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { ReelCard } from "@/components/reel-card";
import { SectionCard } from "@/components/section-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { PlayerProfile, ScoutNote } from "@/lib/types";

export function ScoutPlayerScreen({ playerId }: { playerId: string }) {
  const { token, user } = useAuth();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token || !playerId) {
      return;
    }

    Promise.all([
      apiFetch<PlayerProfile>(`/players/${playerId}`),
      apiFetch<{ players: { id: number }[] }>("/scouts/saved", { token }),
      apiFetch<ScoutNote | null>(`/scouts/notes/${playerId}`, { token }).catch(() => null),
    ])
      .then(([profile, savedPlayers, scoutNote]) => {
        setPlayer(profile);
        setSaved(savedPlayers.players.some((savedPlayer) => savedPlayer.id === profile.id));
        setNote(scoutNote?.note || "");
      })
      .catch(() => {
        setPlayer(null);
      });
  }, [playerId, token]);

  async function toggleSave() {
    if (!token || !player) {
      return;
    }

    if (saved) {
      await apiFetch(`/scouts/save/${player.id}`, { method: "DELETE", token });
      setSaved(false);
    } else {
      await apiFetch(`/scouts/save/${player.id}`, { method: "POST", token });
      setSaved(true);
    }
  }

  async function saveNote() {
    if (!token || !player) {
      return;
    }

    await apiFetch(`/scouts/notes/${player.id}`, {
      method: "POST",
      token,
      body: JSON.stringify({ note }),
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user || user.role !== "scout") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a scout to view player details.</Text>
      </MobileShell>
    );
  }

  if (!player) {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Loading player...</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <ReelCard player={player} profileHref={`/players/${player.id}`} actionLabel={saved ? "Remove saved" : "Save player"} onPressAction={toggleSave} />
        <SectionCard>
          <Text style={styles.sectionTitle}>Private scout note</Text>
          <TextInput
            multiline
            value={note}
            onChangeText={setNote}
            style={styles.noteInput}
            placeholder="Write a private note about this player"
            placeholderTextColor="rgba(8,17,27,0.45)"
          />
          <Pressable onPress={saveNote} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save note</Text>
          </Pressable>
        </SectionCard>
      </MobileShell>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#08111b",
    fontSize: 18,
    fontWeight: "800",
  },
  noteInput: {
    minHeight: 140,
    borderRadius: 18,
    backgroundColor: "#f7faf6",
    padding: 14,
    textAlignVertical: "top",
    color: "#08111b",
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#08111b",
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: "#f7faf6",
    fontWeight: "800",
  },
});
