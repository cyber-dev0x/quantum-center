"use client";

import { useMemo, useRef, useState } from "react";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { MetricTile } from "@/components/ui/metric-tile";
import { Panel } from "@/components/ui/panel";
import { RangeControl } from "@/components/ui/range-control";
import { StatusPill } from "@/components/ui/status-pill";
import { clamp, toPercent } from "@/lib/math";

export function ExperimentsSection() {
  const [rewardWeight, setRewardWeight] = useState(64);
  const [memoryWindow, setMemoryWindow] = useState(18);
  const [mutationRate, setMutationRate] = useState(12);

  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convergence = useMemo(
    () => clamp(0.34 + rewardWeight * 0.004 + memoryWindow * 0.006 - mutationRate * 0.008, 0.05, 0.98),
    [memoryWindow, mutationRate, rewardWeight],
  );

  const generalization = useMemo(
    () => clamp(0.28 - rewardWeight * 0.002 + memoryWindow * 0.01 + mutationRate * 0.006, 0.05, 0.98),
    [memoryWindow, mutationRate, rewardWeight],
  );

  const stability = useMemo(
    () => clamp(0.82 + rewardWeight * 0.001 - mutationRate * 0.012 + memoryWindow * 0.002, 0.05, 0.99),
    [memoryWindow, mutationRate, rewardWeight],
  );

  const runExperiment = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let progress = 0;
    setRunProgress(0);
    setInsights([]);
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      progress += 5;
      setRunProgress(progress);

      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);

        setInsights([
          `Convergence ${convergence > 0.72 ? "strong" : "moderate"} at ${toPercent(convergence)}.`,
          `Generalization ${generalization > 0.62 ? "improves" : "needs tuning"} at ${toPercent(generalization)}.`,
          `Stability ${stability > 0.7 ? "holds under perturbation" : "drops under mutation"}.`,
        ]);
      }
    }, 90);
  };

  return (
    <SectionShell
      id="experiments"
      kicker="LIVE SANDBOX"
      title="Experiments"
      description="Tune reward shaping, memory depth, and mutation rate to see how agent learning dynamics change."
      rightSlot={<StatusPill active={isRunning} onText="RUNNING" offText="READY" />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100">Experiment Controls</h3>
            <span className="text-xs text-zinc-400">parameter sweeps</span>
          </div>

          <div className="space-y-4">
            <RangeControl
              label="Reward Weight"
              min={0}
              max={100}
              value={rewardWeight}
              onChange={setRewardWeight}
            />
            <RangeControl
              label="Memory Window"
              min={1}
              max={40}
              value={memoryWindow}
              onChange={setMemoryWindow}
            />
            <RangeControl
              label="Prompt Mutation"
              min={0}
              max={40}
              value={mutationRate}
              suffix="%"
              onChange={setMutationRate}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={runExperiment} disabled={isRunning}>
              {isRunning ? "Running Sweep…" : "Run Experiment Sweep"}
            </Button>
            <Button tone="secondary" onClick={() => setInsights([])}>
              Clear Notes
            </Button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${runProgress}%` }} />
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricTile label="Convergence" value={toPercent(convergence)} />
            <MetricTile label="Generalization" value={toPercent(generalization)} />
            <MetricTile label="Stability" value={toPercent(stability)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Reward Shaping</p>
              <p className="mt-1 text-sm text-zinc-200">
                Higher reward weight accelerates learning but can overfit to short-term goals.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Memory Depth</p>
              <p className="mt-1 text-sm text-zinc-200">
                Larger memory windows improve context but may increase response latency.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Mutation Rate</p>
              <p className="mt-1 text-sm text-zinc-200">
                Mutation boosts novelty; too much mutation destabilizes repeatability.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <p className="mb-2 text-xs text-zinc-400">Lab Notes</p>
            <ul className="space-y-2 text-xs text-zinc-300">
              {insights.length > 0 ? (
                insights.map((line) => (
                  <li key={line} className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2">
                    {line}
                  </li>
                ))
              ) : (
                <li className="text-zinc-500">Run an experiment sweep to generate findings.</li>
              )}
            </ul>
          </div>
        </Panel>
      </div>
    </SectionShell>
  );
}
