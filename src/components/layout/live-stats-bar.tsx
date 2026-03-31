"use client";

import { useEffect, useState } from "react";
import { clamp } from "@/lib/math";

type Stat = {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  decimals?: number;
};

const INITIAL_STATS: Stat[] = [
  { label: "Agent Uptime", value: 97.2, min: 90, max: 99.9, suffix: "%", decimals: 1 },
  { label: "Inference / sec", value: 142, min: 105, max: 180, decimals: 0 },
  { label: "Scenario Load", value: 61, min: 30, max: 95, suffix: "%", decimals: 0 },
  { label: "Lab Temperature", value: 33.8, min: 24, max: 40, suffix: "°", decimals: 1 },
];

const formatStat = (stat: Stat) => `${stat.value.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;

export function LiveStatsBar() {
  const [stats, setStats] = useState(INITIAL_STATS);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setStats((previous) =>
        previous.map((stat) => {
          const drift = (Math.random() - 0.5) * (stat.max - stat.min) * 0.03;

          return {
            ...stat,
            value: clamp(stat.value + drift, stat.min, stat.max),
          };
        }),
      );
    }, 1800);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section className="border-b border-white/10 bg-zinc-950/70 backdrop-blur-lg">
      <div className="mx-auto grid w-full max-w-6xl gap-2 px-4 py-3 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => {
          const ratio = ((stat.value - stat.min) / (stat.max - stat.min)) * 100;

          return (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2">
              <div className="mb-1 flex items-center justify-between text-[11px] tracking-[0.12em] text-zinc-400">
                <span>{stat.label}</span>
                <span className="text-cyan-300">LIVE</span>
              </div>
              <p className="text-lg font-semibold text-zinc-100">{formatStat(stat)}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-950">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${ratio}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
