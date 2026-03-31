export function HologramCore() {
  return (
    <div className="relative mt-4 flex items-center justify-center">
      <div className="relative h-40 w-40 [perspective:900px]">
        <div className="absolute inset-0 [transform:rotateX(72deg)]">
          <div className="h-full w-full animate-spin rounded-full border border-cyan-300/40" style={{ animationDuration: "12s" }} />
        </div>

        <div className="absolute inset-2 [transform:rotateY(72deg)]">
          <div
            className="h-full w-full animate-spin rounded-full border border-violet-300/30"
            style={{ animationDuration: "9s", animationDirection: "reverse" }}
          />
        </div>

        <div className="absolute inset-5 [transform:rotateX(30deg)]">
          <div className="h-full w-full animate-spin rounded-full border border-cyan-200/40" style={{ animationDuration: "14s" }} />
        </div>

        <div className="absolute inset-x-1/2 top-1/2 h-24 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-200/80 to-transparent blur-[1px]" />
        <div className="absolute inset-x-1/2 top-1/2 h-[2px] w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-violet-300/70 to-transparent blur-[1px]" />

        <div className="animate-pulse-soft absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/40 blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/90 shadow-[0_0_22px_rgba(34,211,238,0.7)]" />
      </div>
    </div>
  );
}
