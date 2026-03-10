"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearSession, getStoredUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export function Nav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        Frency
      </Link>
      <div className="flex items-center gap-3 text-sm">
        {user?.role === "player" ? <Link href="/player/dashboard">Dashboard</Link> : null}
        {user?.role === "player" ? <Link href="/player/profile/edit">Edit</Link> : null}
        {user?.role === "scout" ? <Link href="/scout/discovery">Discovery</Link> : null}
        {user?.role === "scout" ? <Link href="/scout/saved">Saved</Link> : null}
        {user ? (
          <button
            className="border border-ink/15 bg-white"
            onClick={() => {
              clearSession();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
