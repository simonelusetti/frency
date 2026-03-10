import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "@/components/bottom-nav";
import { FormField } from "@/components/form-field";
import { MobileShell } from "@/components/mobile-shell";
import { SectionCard } from "@/components/section-card";
import { apiFetch, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { PlayerProfile } from "@/lib/types";

export function PlayerProfileEditScreen() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
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
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    apiFetch<PlayerProfile>("/players/me", { token })
      .then((currentProfile) => {
        setProfile(currentProfile);
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
      })
      .catch(() => undefined);
  }, [token]);

  async function pickImage() {
    setError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function saveProfile() {
    if (!token) {
      return;
    }

    setError(null);
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      form.append(key, value);
    });
    if (image) {
      form.append("profile_image", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "profile.jpg",
      } as never);
    }

    try {
      await apiFetch("/players/me", {
        method: profile ? "PUT" : "POST",
        token,
        body: form,
      });
      router.replace("/(player)/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save profile");
    }
  }

  if (!user || user.role !== "player") {
    return (
      <MobileShell>
        <Text style={styles.emptyText}>Login as a player to edit your profile.</Text>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell>
        <Text style={styles.title}>{profile ? "Edit profile" : "Create profile"}</Text>
        <SectionCard>
          <View style={styles.previewWrap}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : profile?.profile_image_path ? (
              <Image source={{ uri: mediaUrl(profile.profile_image_path) || undefined }} style={styles.previewImage} />
            ) : (
              <View style={[styles.previewImage, styles.previewFallback]}>
                <Text style={styles.previewFallbackText}>
                  {fields.full_name ? fields.full_name.slice(0, 1).toUpperCase() : "P"}
                </Text>
              </View>
            )}
            <Text style={styles.previewLabel}>
              {image?.fileName || (profile?.profile_image_path ? "Current profile image" : "No profile image selected")}
            </Text>
          </View>
          <FormField label="Full name" value={fields.full_name} onChangeText={(value) => setFields({ ...fields, full_name: value })} />
          <FormField label="Date of birth" value={fields.date_of_birth} onChangeText={(value) => setFields({ ...fields, date_of_birth: value })} placeholder="YYYY-MM-DD" />
          <FormField label="Nationality" value={fields.nationality} onChangeText={(value) => setFields({ ...fields, nationality: value })} />
          <FormField label="Current team" value={fields.current_team} onChangeText={(value) => setFields({ ...fields, current_team: value })} />
          <FormField label="Primary role" value={fields.primary_role} onChangeText={(value) => setFields({ ...fields, primary_role: value })} />
          <FormField label="Secondary role" value={fields.secondary_role} onChangeText={(value) => setFields({ ...fields, secondary_role: value })} />
          <FormField label="Preferred foot" value={fields.preferred_foot} onChangeText={(value) => setFields({ ...fields, preferred_foot: value })} />
          <FormField label="Height cm" value={fields.height_cm} onChangeText={(value) => setFields({ ...fields, height_cm: value })} keyboardType="numeric" />
          <FormField label="Weight kg" value={fields.weight_kg} onChangeText={(value) => setFields({ ...fields, weight_kg: value })} keyboardType="numeric" />
          <FormField label="Availability" value={fields.availability_status} onChangeText={(value) => setFields({ ...fields, availability_status: value })} />
          <FormField label="Bio" value={fields.bio} onChangeText={(value) => setFields({ ...fields, bio: value })} multiline />
          <Pressable onPress={pickImage} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{image ? "Profile image selected" : "Pick profile image"}</Text>
          </Pressable>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable onPress={saveProfile} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{profile ? "Update profile" : "Create profile"}</Text>
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
  previewWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  previewImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: "rgba(8,17,27,0.10)",
    backgroundColor: "#183149",
    marginBottom: 10,
  },
  previewFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewFallbackText: {
    color: "#f7faf6",
    fontSize: 34,
    fontWeight: "800",
  },
  previewLabel: {
    color: "rgba(8,17,27,0.65)",
    fontSize: 13,
    textAlign: "center",
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
  errorText: {
    color: "#b83b3b",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    color: "#f7faf6",
    fontSize: 16,
  },
});
