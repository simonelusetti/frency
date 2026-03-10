import { useLocalSearchParams } from "expo-router";

import { ScoutPlayerScreen } from "@/components/scout-player-screen";

export default function ScoutPlayerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScoutPlayerScreen playerId={id ?? ""} />;
}
