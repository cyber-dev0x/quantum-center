import { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export function SectionShell({
  id,
  kicker,
  title,
  description,
  children,
  rightSlot,
}: SectionShellProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-cyan-300/80">{kicker}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{description}</p>
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  );
}
