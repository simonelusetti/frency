"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { API_URL, apiFetch } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import type { Document, PlayerProfile } from "@/lib/types";

export function PlayerDashboardClient() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshDashboard() {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    const [playerProfile, playerDocuments] = await Promise.all([
      apiFetch<PlayerProfile>("/players/me", { token }).catch(() => null),
      apiFetch<Document[]>("/documents/me", { token }).catch(() => []),
    ]);
    setProfile(playerProfile);
    setDocuments(playerDocuments);
  }

  useEffect(() => {
    const user = getStoredUser();
    const token = getStoredToken();
    if (!user || user.role !== "player" || !token) {
      setLoading(false);
      return;
    }

    refreshDashboard()
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteVideo(videoId: number) {
    const token = getStoredToken();
    if (!token) {
      setError("Login required");
      return;
    }

    try {
      await apiFetch(`/videos/${videoId}`, { method: "DELETE", token });
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete video");
    }
  }

  if (loading) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading dashboard...</div>;
  }

  if (!getStoredUser() || getStoredUser()?.role !== "player") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a player to access the dashboard.</div>;
  }

  if (!profile) {
    return (
      <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Create your player profile</h2>
        <p className="text-sm text-ink/70">
          Your account is ready. Add your football information before scouts can discover you.
        </p>
        <Link href="/player/profile/edit" className="inline-flex rounded-xl bg-field px-4 py-3 text-white">
          Create profile
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{profile.full_name}</h1>
            <p className="mt-2 text-sm text-ink/70">
              {profile.primary_role}
              {profile.secondary_role ? ` / ${profile.secondary_role}` : ""} • {profile.current_team || "Club pending"}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {profile.nationality} • {profile.preferred_foot || "Foot not set"} • {profile.availability_status || "Availability pending"}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/80">{profile.bio || "No bio added yet."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/player/profile/edit" className="rounded-xl border border-ink/[0.15] bg-white px-4 py-3">
              Edit profile
            </Link>
            <Link href={`/players/${profile.id}`} className="rounded-xl border border-ink/[0.15] bg-white px-4 py-3">
              Public page
            </Link>
            <Link href="/player/videos/upload" className="rounded-xl bg-field px-4 py-3 text-white">
              Upload video
            </Link>
            <Link href="/player/documents/upload" className="rounded-xl bg-ink px-4 py-3 text-white">
              Upload document
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Highlight videos</h2>
          <div className="mt-4 grid gap-4">
            {profile.videos.length === 0 ? (
              <p className="text-sm text-ink/70">No videos uploaded yet.</p>
            ) : (
              profile.videos.map((video) => (
                <div key={video.id} className="rounded-2xl border border-ink/10 p-4">
                  <p className="font-medium">{video.title}</p>
                  <p className="mt-1 text-sm text-ink/70">{video.description || "No description"}</p>
                  <video controls className="mt-4 w-full rounded-2xl bg-black">
                    <source src={`${API_URL}${video.file_path}`} type="video/mp4" />
                  </video>
                  <button
                    className="mt-4 border border-ink/[0.15] bg-white text-sm"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Delete video
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Private documents</h2>
          <div className="mt-4 grid gap-4">
            {documents.length === 0 ? (
              <p className="text-sm text-ink/70">No documents uploaded yet.</p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="rounded-2xl border border-ink/10 p-4">
                  <p className="font-medium">{document.title}</p>
                  <p className="mt-1 text-sm text-ink/70">
                    {document.document_type || "Document"} • {document.visibility}
                  </p>
                  <a
                    href={`${API_URL}${document.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm text-field underline"
                  >
                    Open document
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
