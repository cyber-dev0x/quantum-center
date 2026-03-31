import { Panel } from "@/components/ui/panel";

const SIGNALS = [
  { label: "Active Agents", value: "12" },
  { label: "Live Simulations", value: "4" },
  { label: "Experiment Slots", value: "26" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_45%),radial-gradient(circle_at_70%_20%,_rgba(139,92,246,0.17),_transparent_42%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-18 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-cyan-300/90">LIVE AI RESEARCH CENTER</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-5xl">
            Learn AI by building it.
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-300">
            Quantum Center is a hands-on lab where you train models, shape agents, run simulations, and
            learn from real behavior in motion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#training-lab"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
            >
              Enter Training Lab
            </a>
            <a
              href="#agent-lab"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              Build an Agent
            </a>
          </div>
        </div>

        <Panel className="relative p-5">
          <div className="mb-4 flex items-center justify-between text-xs tracking-[0.2em] text-zinc-400">
            <span>LAB SIGNALS</span>
            <span className="text-cyan-300">ONLINE</span>
          </div>
          <div className="space-y-3">
            {SIGNALS.map((signal) => (
              <div key={signal.label} className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
                <p className="text-xs text-zinc-400">{signal.label}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">{signal.value}</p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-300/12" />
        </Panel>
      </div>
    </section>
  );
}
