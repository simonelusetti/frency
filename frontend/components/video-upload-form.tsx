"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";

export function VideoUploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("Login required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch("/videos/upload", {
        method: "POST",
        token,
        body: new FormData(event.currentTarget),
      });
      router.push("/player/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not upload video");
    } finally {
      setLoading(false);
    }
  }

  if (!getStoredUser() || getStoredUser()?.role !== "player") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a player to upload videos.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
      <input name="title" placeholder="Video title" required />
      <textarea name="description" rows={4} placeholder="Short description" />
      <input name="file" type="file" accept="video/mp4" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="bg-field text-white" disabled={loading}>
        {loading ? "Uploading..." : "Upload highlight video"}
      </button>
    </form>
  );
}
