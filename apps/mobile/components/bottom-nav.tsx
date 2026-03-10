import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/lib/auth-context";

export function BottomNav() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const items =
    user.role === "scout"
      ? [
          { label: "Feed", path: "/(scout)/discovery" as const },
          { label: "Saved", path: "/(scout)/saved" as const },
        ]
      : [{ label: "Home", path: "/(player)/dashboard" as const }];

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {items.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.path)} style={styles.navButton}>
            <Text style={styles.navText}>{item.label}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => logout()} style={styles.navButton}>
          <Text style={styles.navText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 0,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
  },
  navText: {
    color: "#08111b",
    fontWeight: "700",
    fontSize: 13,
  },
});
