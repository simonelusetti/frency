import { ScoutPlayerDetailClient } from "@/components/scout-player-detail-client";

type ScoutPlayerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScoutPlayerDetailPage({ params }: ScoutPlayerDetailPageProps) {
  const { id } = await params;

  return (
    <div className="py-10">
      <ScoutPlayerDetailClient playerId={id} />
    </div>
  );
}
