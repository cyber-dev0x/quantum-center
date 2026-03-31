import { SITE_LINKS } from "@/config/links";

const NAV_ITEMS = [
  { href: "#training-lab", label: "Training Lab" },
  { href: "#agent-lab", label: "Agent Lab" },
  { href: "#simulation", label: "Simulation" },
  { href: "#experiments", label: "Experiments" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#" className="text-sm font-semibold tracking-[0.2em] text-cyan-300">
          QUANTUM CENTER
        </a>
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-300 transition hover:text-cyan-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={SITE_LINKS.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
