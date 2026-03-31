import { ReactNode } from "react";

type PanelProps = {
  className?: string;
  children: ReactNode;
};

export function Panel({ className = "", children }: PanelProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-zinc-950/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
