"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import type { PlayerProfile } from "@/lib/types";

export function PlayerProfileEditor() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    const token = getStoredToken();

    if (!user || user.role !== "player" || !token) {
      setLoading(false);
      return;
    }

    apiFetch<PlayerProfile>("/players/me", { token })
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("Login required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await apiFetch<PlayerProfile>("/players/me", {
        method: profile ? "PUT" : "POST",
        token,
        body: formData,
      });
      router.push("/player/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading profile form...</div>;
  }

  if (!getStoredUser() || getStoredUser()?.role !== "player") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a player to edit your profile.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="full_name" defaultValue={profile?.full_name || ""} placeholder="Full name" required />
        <input name="date_of_birth" type="date" defaultValue={profile?.date_of_birth || ""} required />
        <input name="nationality" defaultValue={profile?.nationality || ""} placeholder="Nationality" required />
        <input name="current_team" defaultValue={profile?.current_team || ""} placeholder="Current team" />
        <input name="primary_role" defaultValue={profile?.primary_role || ""} placeholder="Primary role" required />
        <input name="secondary_role" defaultValue={profile?.secondary_role || ""} placeholder="Secondary role" />
        <input name="preferred_foot" defaultValue={profile?.preferred_foot || ""} placeholder="Preferred foot" />
        <input name="height_cm" type="number" defaultValue={profile?.height_cm || ""} placeholder="Height (cm)" />
        <input name="weight_kg" type="number" defaultValue={profile?.weight_kg || ""} placeholder="Weight (kg)" />
        <input
          name="availability_status"
          defaultValue={profile?.availability_status || ""}
          placeholder="Availability status"
        />
      </div>
      <textarea name="bio" rows={5} defaultValue={profile?.bio || ""} placeholder="Bio" />
      <input name="profile_image" type="file" accept="image/*" />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="bg-field text-white" disabled={saving}>
        {saving ? "Saving..." : profile ? "Update profile" : "Create profile"}
      </button>
    </form>
  );
}
