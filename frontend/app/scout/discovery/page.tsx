import { DiscoveryClient } from "@/components/discovery-client";

export default function ScoutDiscoveryPage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Scout Discovery</h1>
        <p className="text-ink/70">Browse players quickly and open detailed profiles in one tap.</p>
      </div>
      <DiscoveryClient />
    </div>
  );
}
