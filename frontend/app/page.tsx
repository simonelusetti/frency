import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="grid gap-6 py-4 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-8 md:py-8">
      <section className="order-2 space-y-5 md:order-1">
        <span className="inline-flex rounded-full bg-field/10 px-4 py-2 text-sm text-field">
          Mobile-first scouting feed
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
          Football discovery built around clips, quick reads, and instant scout decisions.
        </h1>
        <p className="max-w-xl text-base text-ink/[0.72] md:text-lg">
          Open the app on a phone and it behaves like a vertical reel feed. Each player leads with video,
          then profile context, save actions, and private scout notes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/scout/discovery" className="rounded-2xl bg-ink px-5 py-3 text-white">
            Open scout feed
          </Link>
          <Link href="/register" className="rounded-2xl bg-field px-5 py-3 text-white">
            Create account
          </Link>
        </div>
        <div className="glass-panel p-5">
          <p className="text-sm text-ink/[0.60]">Demo accounts</p>
          <div className="mt-3 grid gap-2 text-sm">
            <p>Scout: scout@demo.com / password123</p>
            <p>Player: player@demo.com / password123</p>
          </div>
        </div>
      </section>

      <section className="order-1 md:order-2">
        <div className="video-panel mx-auto max-w-sm p-3">
          <div className="relative aspect-[9/17] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#102235_0%,#0b1320_55%,#08111b_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(79,183,115,0.25),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(255,176,109,0.18),transparent_24%)]" />
            <div className="absolute inset-x-0 top-0 p-4">
              <div className="flex items-center justify-between text-xs text-white/[0.72]">
                <span className="chip">Frency Live Feed</span>
                <span>Scout mode</span>
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-[1.5rem] bg-black/40 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/[0.55]">Featured player</p>
              <h2 className="mt-2 text-2xl font-semibold">Luca Bianchi</h2>
              <p className="mt-1 text-sm text-white/[0.72]">Striker • Italy • AS Verona Academy</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="chip">Explosive first step</span>
                <span className="chip">Pressing forward</span>
                <span className="chip">Open to trials</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link href="/players/1" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-ink">
                  View profile
                </Link>
                <Link href="/scout/discovery" className="rounded-xl border border-white/[0.15] px-4 py-3 text-center text-sm">
                  Start swiping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
