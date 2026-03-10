import { StyleSheet, Text, TextInput, View } from "react-native";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
};

export function FormField(props: FormFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="rgba(8,17,27,0.45)"
        secureTextEntry={props.secureTextEntry}
        multiline={props.multiline}
        keyboardType={props.keyboardType}
        style={[styles.input, props.multiline ? styles.multiline : undefined]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 12,
  },
  label: {
    color: "#08111b",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f7faf6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#08111b",
    fontSize: 15,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },
});
