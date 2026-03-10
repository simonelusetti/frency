"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";

export function DocumentUploadForm() {
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
      await apiFetch("/documents/upload", {
        method: "POST",
        token,
        body: new FormData(event.currentTarget),
      });
      router.push("/player/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not upload document");
    } finally {
      setLoading(false);
    }
  }

  if (!getStoredUser() || getStoredUser()?.role !== "player") {
    return <div className="rounded-3xl bg-white p-6 shadow-sm">Login as a player to upload documents.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
      <input name="title" placeholder="Document title" required />
      <input name="document_type" placeholder="Document type" />
      <select name="visibility" defaultValue="private">
        <option value="private">Private</option>
      </select>
      <input name="file" type="file" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="bg-ink text-white" disabled={loading}>
        {loading ? "Uploading..." : "Upload document"}
      </button>
    </form>
  );
}
