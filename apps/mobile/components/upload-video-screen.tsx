import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { FormField } from "@/components/form-field";
import { MobileShell } from "@/components/mobile-shell";
import { SectionCard } from "@/components/section-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function UploadVideoScreen() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function pickVideo() {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/mp4", copyToCacheDirectory: true });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function uploadVideo() {
    if (!token || !file) {
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("file", {
      uri: file.uri,
      type: file.mimeType || "video/mp4",
      name: file.name,
    } as never);

    await apiFetch("/videos/upload", { method: "POST", token, body: form });
    router.replace("/(player)/dashboard");
  }

  if (!user || user.role !== "player") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a player to upload videos.</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <Text style={styles.title}>Upload video</Text>
        <SectionCard>
          <FormField label="Title" value={title} onChangeText={setTitle} />
          <FormField label="Description" value={description} onChangeText={setDescription} multiline />
          <Pressable onPress={pickVideo} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{file ? file.name : "Pick MP4 file"}</Text>
          </Pressable>
          <Pressable onPress={uploadVideo} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Upload highlight</Text>
          </Pressable>
        </SectionCard>
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
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#4fa36b",
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: "#08111b",
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#08111b",
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: "#f7faf6",
    fontWeight: "800",
  },
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
});
