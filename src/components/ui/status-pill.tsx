type StatusPillProps = {
  active: boolean;
  onText?: string;
  offText?: string;
};

export function StatusPill({ active, onText = "RUNNING", offText = "IDLE" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${
        active
          ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
          : "border-white/15 bg-white/5 text-zinc-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "animate-pulse bg-cyan-300" : "bg-zinc-500"
        }`}
      />
      {active ? onText : offText}
    </span>
  );
}
