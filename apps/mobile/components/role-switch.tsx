import { Pressable, StyleSheet, Text, View } from "react-native";

type Role = "player" | "scout";

type RoleSwitchProps = {
  value: Role;
  onChange: (role: Role) => void;
};

export function RoleSwitch({ value, onChange }: RoleSwitchProps) {
  return (
    <View style={styles.row}>
      {(["player", "scout"] as Role[]).map((role) => (
        <Pressable
          key={role}
          onPress={() => onChange(role)}
          style={[styles.button, value === role ? styles.activeButton : undefined]}
        >
          <Text style={[styles.buttonText, value === role ? styles.activeButtonText : undefined]}>
            {role === "player" ? "Player" : "Scout"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e8efe7",
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#4fa36b",
  },
  buttonText: {
    color: "#08111b",
    fontWeight: "700",
  },
  activeButtonText: {
    color: "#f7faf6",
  },
});
