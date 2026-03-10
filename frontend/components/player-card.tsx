import Link from "next/link";

import type { PlayerCard as PlayerCardType } from "@/lib/types";

type PlayerCardProps = {
  player: PlayerCardType;
  href: string;
};

export function PlayerCard({ player, href }: PlayerCardProps) {
  return (
    <article className="glass-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{player.full_name}</h3>
          <p className="mt-1 text-sm text-ink/[0.65]">
            {player.primary_role}
            {player.secondary_role ? ` / ${player.secondary_role}` : ""} • Age {player.age}
          </p>
        </div>
        <span className="rounded-full bg-field/10 px-3 py-1 text-xs text-field">
          {player.preferred_foot || "Foot N/A"}
        </span>
      </div>
      <div className="mt-4 grid gap-1 text-sm text-ink/75">
        <p>{player.nationality}</p>
        <p>{player.current_team || "No team listed"}</p>
        <p>{player.availability_status || "Availability not set"}</p>
      </div>
      <Link href={href} className="mt-5 inline-flex rounded-xl bg-ink px-4 py-2 text-sm text-white">
        View profile
      </Link>
    </article>
  );
}
