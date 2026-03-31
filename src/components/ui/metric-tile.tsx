import { ReactNode } from "react";

type MetricTileProps = {
  label: string;
  value: string;
  note?: string;
  icon?: ReactNode;
};

export function MetricTile({ label, value, note, icon }: MetricTileProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        {icon}
      </div>
      <div className="text-lg font-semibold text-zinc-100">{value}</div>
      {note && <p className="mt-1 text-xs text-zinc-400">{note}</p>}
    </div>
  );
}
