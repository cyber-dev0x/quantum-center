"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { MetricTile } from "@/components/ui/metric-tile";
import { Panel } from "@/components/ui/panel";
import { RangeControl } from "@/components/ui/range-control";
import { Sparkline } from "@/components/ui/sparkline";
import { StatusPill } from "@/components/ui/status-pill";
import { clamp, randomRange, toPercent } from "@/lib/math";

type TrainingPoint = {
  epoch: number;
  loss: number;
  accuracy: number;
};

const MODEL_OPTIONS = ["Classifier", "Sequence Model", "Anomaly Detector"];

export function TrainingLabSection() {
  const [modelType, setModelType] = useState(MODEL_OPTIONS[0]);
  const [learningRate, setLearningRate] = useState(3);
  const [epochs, setEpochs] = useState(36);
  const [complexity, setComplexity] = useState(6);

  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState<TrainingPoint[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const runTraining = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const targetEpochs = epochs;
    const lr = learningRate / 1000;
    const modelComplexity = complexity;
    let epoch = 0;

    setMetrics([]);
    setCurrentEpoch(0);
    setIsTraining(true);

    timerRef.current = setInterval(() => {
      epoch += 1;

      const normalizedEpoch = epoch / targetEpochs;
      const baseDecay = 1.2 * Math.exp(-normalizedEpoch * (1.8 + modelComplexity * 0.24));
      const noise = randomRange(-0.02, 0.02);

      const loss = clamp(baseDecay + (1 - lr * 110) * 0.06 + noise, 0.03, 1.4);
      const accuracy = clamp(
        0.46 + (1 - loss) * 0.52 + lr * 8 + modelComplexity * 0.012 + randomRange(-0.012, 0.012),
        0.42,
        0.995,
      );

      setMetrics((previous) => [...previous, { epoch, loss, accuracy }]);
      setCurrentEpoch(epoch);

      if (epoch >= targetEpochs) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTraining(false);
      }
    }, 170);
  };

  const lossSeries = useMemo(() => metrics.map((point) => point.loss), [metrics]);
  const accuracySeries = useMemo(() => metrics.map((point) => point.accuracy), [metrics]);

  const latest = metrics[metrics.length - 1];

  const progress = (currentEpoch / epochs) * 100;

  const samplePredictions = useMemo(() => {
    if (!latest) return [];
    const confidenceBase = latest.accuracy;
    return ["Vision", "Text", "Signal"].map((task, index) => {
      const confidence = clamp(confidenceBase - index * 0.035 + randomRange(-0.015, 0.01), 0.55, 0.99);
      return { task, confidence };
    });
  }, [latest]);

  return (
    <SectionShell
      id="training-lab"
      kicker="MODEL WORKBENCH"
      title="Training Lab"
      description="Create lightweight models, run fast training loops, and watch core metrics update in real time."
      rightSlot={<StatusPill active={isTraining} onText="TRAINING" offText="READY" />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100">Model Setup</h3>
            <span className="text-xs text-zinc-400">quick config</span>
          </div>

          <label className="mb-4 flex flex-col gap-2 text-sm text-zinc-300">
            Model Type
            <select
              value={modelType}
              onChange={(event) => setModelType(event.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/50"
            >
              {MODEL_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <div className="space-y-4">
            <RangeControl label="Learning Rate" min={1} max={10} value={learningRate} onChange={setLearningRate} />
            <RangeControl label="Epochs" min={10} max={80} value={epochs} onChange={setEpochs} />
            <RangeControl
              label="Model Complexity"
              min={1}
              max={10}
              value={complexity}
              onChange={setComplexity}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={runTraining} disabled={isTraining}>
              {isTraining ? "Training…" : "Train Model"}
            </Button>
            <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
              LR {(learningRate / 1000).toFixed(3)} · {modelType}
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${progress}%` }} />
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricTile label="Current Epoch" value={`${currentEpoch}/${epochs}`} />
            <MetricTile label="Loss" value={latest ? latest.loss.toFixed(3) : "—"} />
            <MetricTile label="Accuracy" value={latest ? toPercent(latest.accuracy) : "—"} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs text-zinc-400">Loss Curve</p>
              <Sparkline values={lossSeries} stroke="#f472b6" />
            </div>
            <div>
              <p className="mb-2 text-xs text-zinc-400">Accuracy Curve</p>
              <Sparkline values={accuracySeries} stroke="#22d3ee" />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <p className="mb-2 text-xs text-zinc-400">Sample Predictions</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {samplePredictions.length > 0 ? (
                samplePredictions.map((item) => (
                  <div key={item.task} className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2">
                    <p className="text-xs text-zinc-400">{item.task}</p>
                    <p className="text-sm font-semibold text-cyan-200">{toPercent(item.confidence)}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">Train the model to generate predictions.</p>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </SectionShell>
  );
}
