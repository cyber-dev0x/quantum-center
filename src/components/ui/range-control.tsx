import { ChangeEvent } from "react";

type RangeControlProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  suffix = "",
  onChange,
}: RangeControlProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <span>{label}</span>
        <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-cyan-200">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-cyan-400"
      />
    </label>
  );
}
