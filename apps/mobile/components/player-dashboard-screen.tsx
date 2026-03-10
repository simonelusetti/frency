import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { SectionCard } from "@/components/section-card";
import { apiFetch, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Document, PlayerProfile } from "@/lib/types";

type ProfileFields = {
  full_name: string;
  date_of_birth: string;
  nationality: string;
  current_team: string;
  primary_role: string;
  secondary_role: string;
  preferred_foot: string;
  height_cm: string;
  weight_kg: string;
  bio: string;
  availability_status: string;
};

const EMPTY_FIELDS: ProfileFields = {
  full_name: "",
  date_of_birth: "",
  nationality: "",
  current_team: "",
  primary_role: "",
  secondary_role: "",
  preferred_foot: "",
  height_cm: "",
  weight_kg: "",
  bio: "",
  availability_status: "",
};

export function PlayerDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { token, user } = useAuth();
  const scrollRef = useRef<ScrollView | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [fields, setFields] = useState<ProfileFields>(EMPTY_FIELDS);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("Autosave inactive");

  useEffect(() => {
    if (!token) {
      return;
    }

    Promise.all([
      apiFetch<PlayerProfile>("/players/me", { token }).catch(() => null),
      apiFetch<Document[]>("/documents/me", { token }).catch(() => []),
    ]).then(([currentProfile, docs]) => {
      setProfile(currentProfile);
      setDocuments(docs);

      if (currentProfile) {
        setFields({
          full_name: currentProfile.full_name || "",
          date_of_birth: currentProfile.date_of_birth || "",
          nationality: currentProfile.nationality || "",
          current_team: currentProfile.current_team || "",
          primary_role: currentProfile.primary_role || "",
          secondary_role: currentProfile.secondary_role || "",
          preferred_foot: currentProfile.preferred_foot || "",
          height_cm: currentProfile.height_cm ? String(currentProfile.height_cm) : "",
          weight_kg: currentProfile.weight_kg ? String(currentProfile.weight_kg) : "",
          bio: currentProfile.bio || "",
          availability_status: currentProfile.availability_status || "",
        });
      }

      hydratedRef.current = true;
      setSaveState("idle");
      setSaveMessage(currentProfile ? "Profile loaded" : "Complete required fields to create your profile");
    });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [token]);

  const requiredFieldsReady = useMemo(
    () =>
      fields.full_name.trim() &&
      fields.date_of_birth.trim() &&
      fields.nationality.trim() &&
      fields.primary_role.trim(),
    [fields],
  );

  useEffect(() => {
    if (!token || !hydratedRef.current) {
      return;
    }

    if (!requiredFieldsReady && !profile) {
      setSaveState("idle");
      setSaveMessage("Complete full name, DOB, nationality, and primary role");
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void autosaveProfile();
    }, selectedImage ? 250 : 700);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [fields, selectedImage, token]);

  async function autosaveProfile() {
    if (!token) {
      return;
    }

    if (!requiredFieldsReady && !profile) {
      return;
    }

    setSaveState("saving");
    setSaveMessage("Saving profile...");

    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      form.append(key, value);
    });

    if (selectedImage) {
      form.append("profile_image", {
        uri: selectedImage.uri,
        type: selectedImage.mimeType || "image/jpeg",
        name: selectedImage.fileName || "profile.jpg",
      } as never);
    }

    try {
      const nextProfile = await apiFetch<PlayerProfile>("/players/me", {
        method: profile ? "PUT" : "POST",
        token,
        body: form,
      });
      setProfile(nextProfile);
      setSelectedImage(null);
      setSaveState("saved");
      setSaveMessage("All changes saved");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Could not save profile");
    }
  }

  async function pickImageAndAutosave() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      scrollToPage(1);
    }
  }

  function scrollToPage(index: number) {
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  }

  if (!user || user.role !== "player") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a player to access the dashboard.</Text>
      </MobileShell>
    );
  }

  const profileImageUri = selectedImage?.uri || mediaUrl(profile?.profile_image_path) || undefined;

  return (
    <>
      <MobileShell padded={false}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.pagerContent}
        >
          <View style={[styles.page, { width }]}>
            <View style={styles.pageInner}>
              <View style={styles.headerRow}>
                <View style={styles.headerText}>
                  <Text style={styles.title}>{profile?.full_name || "My videos"}</Text>
                  <Text style={styles.copy}>Your public highlight clips live here.</Text>
                </View>
                <Pressable onPress={() => scrollToPage(1)} style={styles.avatarButton}>
                  {profileImageUri ? (
                    <Image source={{ uri: profileImageUri }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                      <Text style={styles.avatarFallbackText}>
                        {fields.full_name ? fields.full_name.slice(0, 1).toUpperCase() : "P"}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>

              <SectionCard>
                <Pressable onPress={() => router.push("/(player)/upload-video")} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Upload new video</Text>
                </Pressable>
              </SectionCard>

              <SectionCard>
                <Text style={styles.sectionTitle}>My videos</Text>
                {profile?.videos?.length ? (
                  profile.videos.map((video) => (
                    <View key={video.id} style={styles.mediaRow}>
                      <Text style={styles.mediaTitle}>{video.title}</Text>
                      <Text style={styles.sectionCopy}>{video.description || "No description"}</Text>
                      <Pressable
                        onPress={() => {
                          const url = mediaUrl(video.file_path);
                          if (url) {
                            Linking.openURL(url);
                          }
                        }}
                        style={styles.mediaButton}
                      >
                        <Text style={styles.mediaButtonText}>Open video</Text>
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <Text style={styles.sectionCopy}>No public videos uploaded yet.</Text>
                )}
              </SectionCard>
            </View>
          </View>

          <View style={[styles.page, { width }]}>
            <ScrollView contentContainerStyle={styles.pageInner} showsVerticalScrollIndicator={false}>
              <View style={styles.headerRow}>
                <View style={styles.headerText}>
                  <Text style={styles.title}>Profile</Text>
                  <Text style={styles.copy}>Edit here. Everything saves automatically.</Text>
                </View>
                <Pressable onPress={pickImageAndAutosave} style={styles.avatarButton}>
                  {profileImageUri ? (
                    <Image source={{ uri: profileImageUri }} style={styles.avatarLarge} />
                  ) : (
                    <View style={[styles.avatarLarge, styles.avatarFallback]}>
                      <Text style={styles.avatarFallbackText}>
                        {fields.full_name ? fields.full_name.slice(0, 1).toUpperCase() : "P"}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>

              <SectionCard>
                <Text style={styles.sectionTitle}>Autosave</Text>
                <Text
                  style={[
                    styles.sectionCopy,
                    saveState === "error" ? styles.errorText : saveState === "saved" ? styles.savedText : undefined,
                  ]}
                >
                  {saveMessage}
                </Text>
              </SectionCard>

              <SectionCard>
                <TextInput
                  style={styles.input}
                  value={fields.full_name}
                  onChangeText={(value) => setFields((current) => ({ ...current, full_name: value }))}
                  placeholder="Full name"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.date_of_birth}
                  onChangeText={(value) => setFields((current) => ({ ...current, date_of_birth: value }))}
                  placeholder="Date of birth (YYYY-MM-DD)"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.nationality}
                  onChangeText={(value) => setFields((current) => ({ ...current, nationality: value }))}
                  placeholder="Nationality"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.current_team}
                  onChangeText={(value) => setFields((current) => ({ ...current, current_team: value }))}
                  placeholder="Current team"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.primary_role}
                  onChangeText={(value) => setFields((current) => ({ ...current, primary_role: value }))}
                  placeholder="Primary role"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.secondary_role}
                  onChangeText={(value) => setFields((current) => ({ ...current, secondary_role: value }))}
                  placeholder="Secondary role"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.preferred_foot}
                  onChangeText={(value) => setFields((current) => ({ ...current, preferred_foot: value }))}
                  placeholder="Preferred foot"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={styles.input}
                  value={fields.height_cm}
                  onChangeText={(value) => setFields((current) => ({ ...current, height_cm: value }))}
                  placeholder="Height cm"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={fields.weight_kg}
                  onChangeText={(value) => setFields((current) => ({ ...current, weight_kg: value }))}
                  placeholder="Weight kg"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={fields.availability_status}
                  onChangeText={(value) => setFields((current) => ({ ...current, availability_status: value }))}
                  placeholder="Availability"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                />
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={fields.bio}
                  onChangeText={(value) => setFields((current) => ({ ...current, bio: value }))}
                  placeholder="Bio"
                  placeholderTextColor="rgba(8,17,27,0.45)"
                  multiline
                />
              </SectionCard>
            </ScrollView>
          </View>

          <View style={[styles.page, { width }]}>
            <View style={styles.pageInner}>
              <View style={styles.headerRow}>
                <View style={styles.headerText}>
                  <Text style={styles.title}>Contracts</Text>
                  <Text style={styles.copy}>Private paperwork and supporting documents.</Text>
                </View>
              </View>

              <SectionCard>
                <Pressable onPress={() => router.push("/(player)/upload-document")} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Upload contract or document</Text>
                </Pressable>
              </SectionCard>

              <SectionCard>
                <Text style={styles.sectionTitle}>My documents</Text>
                {documents.length ? (
                  documents.map((document) => (
                    <View key={document.id} style={styles.mediaRow}>
                      <Text style={styles.mediaTitle}>{document.title}</Text>
                      <Text style={styles.sectionCopy}>
                        {document.document_type || "Document"} • {document.visibility}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.sectionCopy}>No private documents uploaded yet.</Text>
                )}
              </SectionCard>
            </View>
          </View>
        </ScrollView>
      </MobileShell>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  pagerContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
  },
  pageInner: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: "#f7faf6",
    fontSize: 34,
    fontWeight: "800",
  },
  copy: {
    color: "rgba(247,250,246,0.72)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  avatarButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "#183149",
  },
  avatarLarge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "#183149",
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#f7faf6",
    fontSize: 30,
    fontWeight: "800",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#4fa36b",
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: "#08111b",
    fontWeight: "800",
    fontSize: 15,
  },
  sectionTitle: {
    color: "#08111b",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  sectionCopy: {
    color: "rgba(8,17,27,0.72)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  mediaRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(8,17,27,0.08)",
  },
  mediaTitle: {
    color: "#08111b",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  mediaButton: {
    alignSelf: "flex-start",
    borderRadius: 14,
    backgroundColor: "#08111b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  mediaButtonText: {
    color: "#f7faf6",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#f7faf6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#08111b",
    fontSize: 15,
    marginBottom: 12,
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  savedText: {
    color: "#1f7d42",
  },
  errorText: {
    color: "#b83b3b",
  },
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
});
