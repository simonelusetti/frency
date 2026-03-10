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
    <>
      <nav className="glass-panel mb-4 flex items-center justify-between px-4 py-3 md:px-5">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Frency
          </Link>
          <p className="mt-0.5 text-xs text-ink/[0.55]">Scout football through video, not spreadsheets.</p>
        </div>
        <div className="hidden items-center gap-3 text-sm md:flex">
          {user?.role === "player" ? <Link href="/player/dashboard">Dashboard</Link> : null}
          {user?.role === "player" ? <Link href="/player/profile/edit">Edit profile</Link> : null}
          {user?.role === "scout" ? <Link href="/scout/discovery">Discovery</Link> : null}
          {user?.role === "scout" ? <Link href="/scout/saved">Saved</Link> : null}
          {user ? (
            <button
              className="border border-ink/[0.15] bg-white"
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

      <nav className="fixed inset-x-3 bottom-3 z-30 rounded-[1.5rem] border border-white/50 bg-white/[0.85] p-2 shadow-[0_18px_50px_rgba(8,20,34,0.16)] backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <Link className="rounded-xl px-3 py-2" href={user?.role === "player" ? "/player/dashboard" : "/"}>
            Home
          </Link>
          <Link className="rounded-xl px-3 py-2" href={user?.role === "player" ? "/player/videos/upload" : "/scout/discovery"}>
            Feed
          </Link>
          <Link className="rounded-xl px-3 py-2" href={user?.role === "scout" ? "/scout/saved" : "/player/profile/edit"}>
            {user?.role === "scout" ? "Saved" : "Profile"}
          </Link>
          {user ? (
            <button
              className="rounded-xl border border-ink/10 bg-white px-3 py-2"
              onClick={() => {
                clearSession();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          ) : (
            <Link className="rounded-xl px-3 py-2" href="/login">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
