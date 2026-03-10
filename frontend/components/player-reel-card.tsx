"use client";

import Link from "next/link";

import { API_URL } from "@/lib/api";
import type { PlayerCard, Video } from "@/lib/types";

type PlayerReelCardProps = {
  player: PlayerCard;
  profileHref: string;
  actionSlot?: React.ReactNode;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  video?: Video | null;
};

export function PlayerReelCard({
  player,
  profileHref,
  actionSlot,
  primaryActionHref,
  primaryActionLabel,
  video,
}: PlayerReelCardProps) {
  return (
    <article className="video-panel min-h-[78svh] md:min-h-[42rem]">
      <div className="relative flex min-h-[78svh] flex-col justify-end md:min-h-[42rem]">
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          >
            <source src={`${API_URL}${video.file_path}`} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#17324b_0%,#0a1420_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,18,0.12)_0%,rgba(4,11,18,0.18)_38%,rgba(4,11,18,0.82)_100%)]" />

        <div className="relative z-10 p-4 md:p-6">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-white/[0.82]">
            <span className="chip">{player.primary_role}</span>
            {player.preferred_foot ? <span className="chip">{player.preferred_foot} foot</span> : null}
            {player.availability_status ? <span className="chip">{player.availability_status}</span> : null}
          </div>

          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold md:text-4xl">{player.full_name}</h2>
            <p className="mt-2 text-sm text-white/[0.76] md:text-base">
              {player.nationality} • Age {player.age} • {player.current_team || "Club not listed"}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/[0.76] md:text-base">
              {player.bio || "Open the profile for role details, videos, and scout context."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={profileHref} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink">
              Open profile
            </Link>
            {primaryActionHref && primaryActionLabel ? (
              <Link
                href={primaryActionHref}
                className="rounded-2xl border border-white/[0.18] bg-white/10 px-4 py-3 text-sm"
              >
                {primaryActionLabel}
              </Link>
            ) : null}
            {actionSlot}
          </div>
        </div>
      </div>
    </article>
  );
}
