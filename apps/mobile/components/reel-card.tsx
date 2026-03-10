import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { mediaUrl } from "@/lib/api";
import type { PlayerProfile } from "@/lib/types";

type ReelCardProps = {
  player: PlayerProfile;
  profileHref: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function ReelCard({ player, profileHref, actionLabel, onPressAction }: ReelCardProps) {
  const router = useRouter();
  const firstVideo = player.videos[0];
  const profileImage = mediaUrl(player.profile_image_path);

  return (
    <View style={styles.card}>
      <View style={styles.videoArea}>
        {profileImage ? <Image source={{ uri: profileImage }} style={styles.coverImage} resizeMode="cover" /> : null}
        <View style={styles.videoGradient} />
        <Text style={styles.videoTag}>{firstVideo ? "Highlight clip" : "Profile preview"}</Text>
        {profileImage ? <Image source={{ uri: profileImage }} style={styles.avatar} /> : null}
        <View style={styles.videoOverlay}>
          <Text style={styles.title}>{player.full_name}</Text>
          <Text style={styles.meta}>
            {player.primary_role}
            {player.secondary_role ? ` / ${player.secondary_role}` : ""} • {player.nationality} • Age {player.age}
          </Text>
          <Text style={styles.team}>{player.current_team || "Independent"} • {player.preferred_foot || "Foot not set"}</Text>
          <Text style={styles.bio} numberOfLines={3}>
            {player.bio || "Open the profile for the full video, background, and scout actions."}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={() => router.push(profileHref as never)} style={styles.primaryLink}>
              <Text style={styles.primaryLinkText}>Open profile</Text>
            </Pressable>
            {actionLabel && onPressAction ? (
              <Pressable onPress={onPressAction} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{actionLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#08111b",
  },
  videoArea: {
    minHeight: 640,
    justifyContent: "flex-end",
    backgroundColor: "#112235",
  },
  videoGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16,34,53,0.78)",
  },
  videoTag: {
    position: "absolute",
    top: 18,
    left: 18,
    color: "rgba(247,250,246,0.82)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  avatar: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "#183149",
  },
  videoOverlay: {
    gap: 10,
    backgroundColor: "rgba(4,11,18,0.55)",
    padding: 18,
  },
  title: {
    color: "#f7faf6",
    fontSize: 30,
    fontWeight: "800",
  },
  meta: {
    color: "rgba(247,250,246,0.78)",
    fontSize: 14,
  },
  team: {
    color: "rgba(247,250,246,0.68)",
    fontSize: 14,
  },
  bio: {
    color: "rgba(247,250,246,0.76)",
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  primaryLink: {
    flex: 1,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#f7faf6",
    paddingVertical: 14,
  },
  primaryLinkText: {
    color: "#08111b",
    fontWeight: "800",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#f7faf6",
    fontWeight: "800",
  },
});
