import { useRouter } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";

import { MobileShell } from "@/components/mobile-shell";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <MobileShell scroll={false} padded={false}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Frency Mobile</Text>
          <Text style={styles.title}>Scout football through a vertical video feed.</Text>
          <Text style={styles.copy}>
            Players post clips and profiles. Scouts save talent, add notes, and move fast.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Demo accounts</Text>
          <Text style={styles.cardCopy}>Scout: scout@demo.com / password123</Text>
          <Text style={styles.cardCopy}>Player: player@demo.com / password123</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => router.push("/(auth)/login")} style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/(auth)/register")} style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 24,
  },
  kicker: {
    color: "#4fa36b",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 16,
  },
  title: {
    color: "#f7faf6",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
    marginBottom: 16,
  },
  copy: {
    color: "rgba(247,250,246,0.74)",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: 18,
    marginBottom: 24,
  },
  cardLabel: {
    color: "#f7faf6",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardCopy: {
    color: "rgba(247,250,246,0.72)",
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {},
  button: {
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
  },
  primaryButton: {
    backgroundColor: "#4fa36b",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#f7faf6",
  },
  primaryButtonText: {
    color: "#08111b",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#08111b",
    fontSize: 16,
    fontWeight: "700",
  },
});
