import { PublicPlayerProfileClient } from "@/components/public-player-profile-client";

type PlayerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;

  return (
    <div className="py-10">
      <PublicPlayerProfileClient playerId={id} />
    </div>
  );
}
