"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { RangeControl } from "@/components/ui/range-control";
import { StatusPill } from "@/components/ui/status-pill";
import { clamp } from "@/lib/math";

type AgentScores = {
  explorer: number;
  planner: number;
  guard: number;
};

type ScenarioId = "data-drift" | "resource-stress" | "multi-agent" | "noisy-input";

const SCENARIOS: { id: ScenarioId; name: string; hints: string[] }[] = [
  {
    id: "data-drift",
    name: "Data Drift",
    hints: ["Feature distribution shifts", "Model confidence drops", "Agents self-calibrate"],
  },
  {
    id: "resource-stress",
    name: "Resource Stress",
    hints: ["Compute budget decreases", "Agents prioritize tasks", "Latency constraints tighten"],
  },
  {
    id: "multi-agent",
    name: "Multi-Agent Negotiation",
    hints: ["Agents compete for goals", "Consensus impacts score", "Coordination improves outcomes"],
  },
  {
    id: "noisy-input",
    name: "Noisy Inputs",
    hints: ["Signal contamination", "Robustness checks activate", "Error correction loops"],
  },
];

const SCENARIO_EVENTS: Record<ScenarioId, string[]> = {
  "data-drift": [
    "Explorer detected feature shift",
    "Planner retrained policy slice",
    "Guard enabled confidence fallback",
    "Agent ensemble stabilized",
  ],
  "resource-stress": [
    "Planner moved priority queue",
    "Guard throttled low-value tasks",
    "Explorer compressed memory map",
    "Compute balance restored",
  ],
  "multi-agent": [
    "Explorer proposed alternate route",
    "Planner accepted consensus plan",
    "Guard vetoed risky branch",
    "Team reward improved",
  ],
  "noisy-input": [
    "Explorer flagged noisy channel",
    "Guard added denoising barrier",
    "Planner reranked uncertain outputs",
    "Signal quality recovered",
  ],
};

const INITIAL_SCORES: AgentScores = {
  explorer: 62,
  planner: 66,
  guard: 70,
};

export function SimulationSection() {
  const [scenario, setScenario] = useState<ScenarioId>(SCENARIOS[0].id);
  const [speed, setSpeed] = useState(2);
  const [steps, setSteps] = useState(24);

  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [scores, setScores] = useState<AgentScores>(INITIAL_SCORES);
  const [events, setEvents] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTick(0);
    setScores(INITIAL_SCORES);
    setEvents([]);
  };

  const runSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const scenarioEvents = SCENARIO_EVENTS[scenario];
    let currentTick = 0;

    setTick(0);
    setScores(INITIAL_SCORES);
    setEvents([]);
    setIsRunning(true);

    timerRef.current = setInterval(
      () => {
        currentTick += 1;

        const scenarioBias =
          scenario === "data-drift"
            ? { explorer: 0.7, planner: 0.4, guard: 0.5 }
            : scenario === "resource-stress"
              ? { explorer: 0.2, planner: 0.6, guard: 0.8 }
              : scenario === "multi-agent"
                ? { explorer: 0.5, planner: 0.8, guard: 0.3 }
                : { explorer: 0.6, planner: 0.2, guard: 0.7 };

        setScores((prev) => ({
          explorer: clamp(prev.explorer + (Math.random() - 0.48) * 4 + scenarioBias.explorer, 35, 99),
          planner: clamp(prev.planner + (Math.random() - 0.5) * 4 + scenarioBias.planner, 35, 99),
          guard: clamp(prev.guard + (Math.random() - 0.52) * 4 + scenarioBias.guard, 35, 99),
        }));

        const event = scenarioEvents[Math.floor(Math.random() * scenarioEvents.length)];
        setEvents((prev) => [`T+${currentTick}: ${event}`, ...prev].slice(0, 7));

        setTick(currentTick);

        if (currentTick >= steps) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
        }
      },
      clamp(620 - speed * 120, 120, 640),
    );
  };

  const completion = (tick / steps) * 100;

  const teamScore = useMemo(
    () => ((scores.explorer + scores.planner + scores.guard) / 3).toFixed(1),
    [scores.explorer, scores.guard, scores.planner],
  );

  const selectedScenario = SCENARIOS.find((item) => item.id === scenario) ?? SCENARIOS[0];

  return (
    <SectionShell
      id="simulation"
      kicker="SCENARIO ENGINE"
      title="Simulation"
      description="Run dynamic environments and observe how multiple agents adapt under pressure."
      rightSlot={<StatusPill active={isRunning} onText="SIMULATING" offText="READY" />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100">Scenario Controls</h3>
            <span className="text-xs text-zinc-400">step-based runtime</span>
          </div>

          <label className="mb-4 flex flex-col gap-2 text-sm text-zinc-300">
            Scenario
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioId)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/50"
            >
              {SCENARIOS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-4">
            <RangeControl label="Simulation Speed" min={1} max={4} value={speed} suffix="x" onChange={setSpeed} />
            <RangeControl label="Total Steps" min={8} max={50} value={steps} onChange={setSteps} />
          </div>

          <ul className="mt-5 space-y-2 rounded-xl border border-white/10 bg-zinc-900/70 p-3 text-xs text-zinc-300">
            {selectedScenario.hints.map((hint) => (
              <li key={hint}>• {hint}</li>
            ))}
          </ul>

          <div className="mt-5 flex gap-3">
            <Button onClick={runSimulation} disabled={isRunning}>
              {isRunning ? "Running…" : "Run Scenario"}
            </Button>
            <Button tone="secondary" onClick={resetSimulation}>
              Reset
            </Button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${completion}%` }} />
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Step</p>
              <p className="text-lg font-semibold text-zinc-100">
                {tick}/{steps}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Explorer</p>
              <p className="text-lg font-semibold text-cyan-200">{scores.explorer.toFixed(1)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Planner</p>
              <p className="text-lg font-semibold text-cyan-200">{scores.planner.toFixed(1)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Team Score</p>
              <p className="text-lg font-semibold text-cyan-200">{teamScore}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            {([
              ["Explorer", scores.explorer],
              ["Planner", scores.planner],
              ["Guard", scores.guard],
            ] as const).map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                  <span>{label}</span>
                  <span>{value.toFixed(1)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-950">
                  <div className="h-full bg-cyan-400" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <p className="mb-2 text-xs text-zinc-400">Simulation Feed</p>
            <ul className="space-y-2 text-xs">
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event} className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-300">
                    {event}
                  </li>
                ))
              ) : (
                <li className="text-zinc-500">Run a scenario to stream events.</li>
              )}
            </ul>
          </div>
        </Panel>
      </div>
    </SectionShell>
  );
}
