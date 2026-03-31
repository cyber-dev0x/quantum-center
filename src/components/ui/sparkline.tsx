import { clamp } from "@/lib/math";

type SparklineProps = {
  values: number[];
  className?: string;
  stroke?: string;
};

export function Sparkline({ values, className = "", stroke = "#67e8f9" }: SparklineProps) {
  if (values.length < 2) {
    return <div className={`h-20 rounded-lg bg-zinc-900/70 ${className}`} />;
  }

  const width = 260;
  const height = 80;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const normalized = clamp((value - min) / range, 0, 1);
      const y = height - normalized * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-20 w-full rounded-lg bg-zinc-900/70 ${className}`}
      role="img"
      aria-label="metric trend"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
