import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export function SectionCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 16,
  },
});
