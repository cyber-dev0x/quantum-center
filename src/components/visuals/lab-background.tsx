"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  velocity: number;
  radius: number;
};

const PARTICLE_COUNT = 130;
const DEPTH = 1400;
const FOV = 320;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createParticle = (width: number, height: number): Particle => ({
  x: (Math.random() - 0.5) * width * 1.8,
  y: (Math.random() - 0.5) * height * 1.8,
  z: Math.random() * DEPTH,
  velocity: 1.8 + Math.random() * 2.5,
  radius: 0.55 + Math.random() * 1.2,
});

export function LabBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;

    const render = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      const shiftX = Math.sin(t * 0.15) * 45;

      for (const particle of particles) {
        particle.z -= particle.velocity;

        if (particle.z <= 1) {
          const reset = createParticle(width, height);
          particle.x = reset.x;
          particle.y = reset.y;
          particle.z = DEPTH;
          particle.velocity = reset.velocity;
          particle.radius = reset.radius;
        }

        const scale = FOV / particle.z;
        const x = particle.x * scale + width / 2 + shiftX;
        const y = particle.y * scale + height / 2;

        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;

        const alpha = clamp(1 - particle.z / DEPTH, 0.08, 0.8);
        const size = particle.radius * scale * 2.7;

        ctx.beginPath();
        ctx.fillStyle = `rgba(103, 232, 249, ${alpha})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(width / 2, height * 0.78);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 1;

      for (let row = 1; row <= 12; row += 1) {
        const depthRatio = row / 12;
        const y = -Math.pow(depthRatio, 2) * height * 0.64;
        const span = width * (0.13 + depthRatio * 0.48);

        ctx.beginPath();
        ctx.moveTo(-span, y);
        ctx.lineTo(span, y);
        ctx.stroke();
      }

      for (let column = -10; column <= 10; column += 1) {
        const baseX = (column / 10) * width * 0.55;
        const topX = baseX * 0.05 + Math.sin(t * 0.35 + column * 0.4) * 16;

        ctx.beginPath();
        ctx.moveTo(baseX, 0);
        ctx.lineTo(topX, -height * 0.66);
        ctx.stroke();
      }

      ctx.restore();

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full opacity-[0.55]" />

      <div className="animate-drift-slow absolute -left-40 top-8 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[110px]" />
      <div className="animate-drift-reverse absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-500/14 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,11,0.9)_100%)]" />
    </div>
  );
}
