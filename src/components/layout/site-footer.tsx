import { SITE_LINKS } from "@/config/links";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Quantum Center · Learn AI by building it.</p>
        <a href={SITE_LINKS.github} target="_blank" rel="noreferrer" className="text-cyan-300">
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}
