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

export function UploadDocumentScreen() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function uploadDocument() {
    if (!token || !file) {
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("document_type", documentType);
    form.append("visibility", "private");
    form.append("file", {
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
      name: file.name,
    } as never);

    await apiFetch("/documents/upload", { method: "POST", token, body: form });
    router.replace("/(player)/dashboard");
  }

  if (!user || user.role !== "player") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a player to upload documents.</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <Text style={styles.title}>Upload document</Text>
        <SectionCard>
          <FormField label="Title" value={title} onChangeText={setTitle} />
          <FormField label="Document type" value={documentType} onChangeText={setDocumentType} />
          <Pressable onPress={pickDocument} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{file ? file.name : "Pick document"}</Text>
          </Pressable>
          <Pressable onPress={uploadDocument} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Upload private document</Text>
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
