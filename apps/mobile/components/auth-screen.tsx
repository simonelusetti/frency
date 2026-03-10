import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";

import { FormField } from "@/components/form-field";
import { MobileShell } from "@/components/mobile-shell";
import { RoleSwitch } from "@/components/role-switch";
import { SectionCard } from "@/components/section-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { AuthResponse } from "@/lib/types";

type AuthScreenProps = {
  mode: "login" | "register";
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { storeSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"player" | "scout">("player");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      if (mode === "register") {
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, role }),
          headers: { "Content-Type": "application/json" },
        });
      }

      const auth = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      await storeSession(auth);
      router.replace(auth.user.role === "scout" ? "/(scout)/discovery" : "/(player)/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell scroll={false}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.root}>
              <View style={styles.header}>
                <Text style={styles.title}>{mode === "login" ? "Login" : "Create account"}</Text>
                <Text style={styles.copy}>
                  {mode === "login"
                    ? "Access your scout or player mobile workspace."
                    : "Choose your role and get into the mobile feed."}
                </Text>
              </View>

              <SectionCard>
                <FormField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="you@example.com"
                />
                <FormField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Your password"
                />
                {mode === "register" ? <RoleSwitch value={role} onChange={setRole} /> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Pressable onPress={submit} style={styles.button} disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
                  </Text>
                </Pressable>
              </SectionCard>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 32,
  },
  root: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 24,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: "#f7faf6",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
  },
  copy: {
    color: "rgba(247,250,246,0.72)",
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#4fa36b",
    paddingVertical: 15,
  },
  buttonText: {
    color: "#08111b",
    fontWeight: "800",
    fontSize: 15,
  },
  error: {
    color: "#b83b3b",
    fontSize: 13,
    marginBottom: 12,
  },
});
