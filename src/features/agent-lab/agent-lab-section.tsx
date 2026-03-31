"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { MetricTile } from "@/components/ui/metric-tile";
import { Panel } from "@/components/ui/panel";
import { RangeControl } from "@/components/ui/range-control";
import { StatusPill } from "@/components/ui/status-pill";
import { clamp, randomRange, toPercent } from "@/lib/math";

type AgentAction = {
  id: number;
  time: string;
  action: string;
  confidence: number;
};

const OBJECTIVES = ["Research Assistant", "Navigator", "Ops Optimizer"];

const ACTION_POOLS: Record<string, string[]> = {
  "Research Assistant": ["Scan data traces", "Hypothesis update", "Request feedback loop", "Refine prompt stack"],
  Navigator: ["Probe environment", "Evaluate path risk", "Set waypoint", "Re-route decision"],
  "Ops Optimizer": ["Detect bottleneck", "Shift compute budget", "Queue prioritization", "Schedule retry"],
};

export function AgentLabSection() {
  const [agentName, setAgentName] = useState("Quantum-01");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [curiosity, setCuriosity] = useState(65);
  const [caution, setCaution] = useState(42);
  const [autonomy, setAutonomy] = useState(72);

  const [isTesting, setIsTesting] = useState(false);
  const [actionLog, setActionLog] = useState<AgentAction[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const runAgentTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const actionPool = ACTION_POOLS[objective];
    const riskBias = curiosity - caution;
    let tick = 0;

    setActionLog([]);
    setIsTesting(true);

    timerRef.current = setInterval(() => {
      tick += 1;
      const pickedAction = actionPool[Math.floor(randomRange(0, actionPool.length))];
      const confidence = clamp(0.55 + autonomy * 0.003 + riskBias * 0.002 + randomRange(-0.11, 0.09), 0.32, 0.98);

      const entry: AgentAction = {
        id: Date.now() + tick,
        time: new Date().toLocaleTimeString(),
        action: `${pickedAction} · step ${tick}`,
        confidence,
      };

      setActionLog((previous) => [entry, ...previous].slice(0, 8));

      if (tick >= 6) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTesting(false);
      }
    }, 420);
  };

  const riskProfile = useMemo(() => clamp((curiosity - caution + 100) / 200, 0, 1), [caution, curiosity]);
  const stability = useMemo(() => clamp((caution + (100 - curiosity)) / 200, 0, 1), [caution, curiosity]);
  const initiative = useMemo(() => clamp((autonomy + curiosity) / 200, 0, 1), [autonomy, curiosity]);

  return (
    <SectionShell
      id="agent-lab"
      kicker="BEHAVIOR ENGINE"
      title="Agent Lab"
      description="Define goals and behavior vectors, then run live action tests to inspect agent decisions."
      rightSlot={<StatusPill active={isTesting} onText="TESTING" offText="READY" />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100">Agent Profile</h3>
            <span className="text-xs text-zinc-400">live behavior tuning</span>
          </div>

          <label className="mb-4 flex flex-col gap-2 text-sm text-zinc-300">
            Agent Name
            <input
              value={agentName}
              onChange={(event) => setAgentName(event.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/50"
            />
          </label>

          <label className="mb-4 flex flex-col gap-2 text-sm text-zinc-300">
            Objective
            <select
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/50"
            >
              {OBJECTIVES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="space-y-4">
            <RangeControl label="Curiosity" min={0} max={100} value={curiosity} onChange={setCuriosity} />
            <RangeControl label="Caution" min={0} max={100} value={caution} onChange={setCaution} />
            <RangeControl label="Autonomy" min={0} max={100} value={autonomy} onChange={setAutonomy} />
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={runAgentTest} disabled={isTesting || !agentName.trim()}>
              {isTesting ? "Running Test…" : "Run Action Test"}
            </Button>
            <Button tone="secondary" onClick={() => setActionLog([])}>
              Clear Log
            </Button>
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricTile label="Risk Profile" value={toPercent(riskProfile)} />
            <MetricTile label="Stability" value={toPercent(stability)} />
            <MetricTile label="Initiative" value={toPercent(initiative)} />
          </div>

          <div className="mb-4 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Agent Signature</span>
              <span className="text-cyan-300">{agentName || "Unnamed"}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-950 p-2 text-xs text-zinc-400">
                Objective <p className="mt-1 text-sm text-zinc-100">{objective}</p>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2 text-xs text-zinc-400">
                Safety Index
                <p className="mt-1 text-sm text-zinc-100">{toPercent(clamp((caution + 20) / 120, 0, 1))}</p>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2 text-xs text-zinc-400">
                Decision Latency
                <p className="mt-1 text-sm text-zinc-100">{Math.max(120, 540 - autonomy * 3)} ms</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <p className="mb-2 text-xs text-zinc-400">Action Log</p>
            <ul className="space-y-2">
              {actionLog.length > 0 ? (
                actionLog.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="text-zinc-200">{entry.action}</p>
                      <p className="text-zinc-500">{entry.time}</p>
                    </div>
                    <span className="font-mono text-cyan-300">{toPercent(entry.confidence)}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-zinc-500">Run a test to inspect the action stream.</li>
              )}
            </ul>
          </div>
        </Panel>
      </div>
    </SectionShell>
  );
}
