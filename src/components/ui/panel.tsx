"use client";

import { CSSProperties, MouseEventHandler, ReactNode, useState } from "react";

type PanelProps = {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
};

export function Panel({ className = "", children, interactive = true }: PanelProps) {
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const reset = () => setStyle(undefined);

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!interactive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;

    setStyle({
      transform: `perspective(980px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      backgroundImage: `radial-gradient(circle at ${Math.round(px * 100)}% ${Math.round(py * 100)}%, rgba(34,211,238,0.12), transparent 45%)`,
    });
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={style}
      className={`rounded-2xl border border-white/10 bg-zinc-950/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
