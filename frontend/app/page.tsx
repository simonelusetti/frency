import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="grid min-h-[76vh] items-center gap-10 py-8 md:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <span className="inline-flex rounded-full bg-field/10 px-4 py-2 text-sm text-field">
          Video-first scouting MVP
        </span>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
          A local football scouting platform built like a mix of TikTok highlights and LinkedIn profiles.
        </h1>
        <p className="max-w-2xl text-lg text-ink/70">
          Players publish profiles, highlight videos, and private documents. Scouts move through discovery,
          save prospects, and keep private notes in one clean local prototype.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/register" className="rounded-xl bg-field px-5 py-3 text-white">
            Start here
          </Link>
          <Link href="/scout/discovery" className="rounded-xl border border-ink/15 bg-white px-5 py-3">
            Explore talent
          </Link>
        </div>
        <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
          <p className="text-sm text-ink/70">Demo accounts</p>
          <p className="mt-2 text-sm">Scout: scout@demo.com / password123</p>
          <p className="text-sm">Player: player@demo.com / password123</p>
        </div>
      </section>
      <section className="grid gap-4">
        <div className="rounded-[2rem] bg-ink p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">For scouts</p>
          <p className="mt-3 text-2xl font-semibold">Fast discovery, saved players, private notes.</p>
          <p className="mt-4 text-sm text-white/70">
            Filter by role, nationality, footedness, and age without production overhead.
          </p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">For players</p>
          <p className="mt-3 text-2xl font-semibold">Profiles, videos, and private contract uploads.</p>
          <p className="mt-4 text-sm text-ink/70">
            Publish your football story while keeping sensitive documents visible only to you.
          </p>
        </div>
        <div className="rounded-[2rem] bg-clay p-6 text-ink shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/50">MVP stack</p>
          <p className="mt-3 text-lg font-semibold">
            Next.js + FastAPI, SQLite, local file storage, one backend process, one frontend process.
          </p>
        </div>
      </section>
    </div>
  );
}
