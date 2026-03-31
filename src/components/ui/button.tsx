import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary";
};

export function Button({ tone = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const styles =
    tone === "primary"
      ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
      : "border border-white/15 bg-zinc-900 text-zinc-100 hover:border-cyan-400/40 hover:text-cyan-100";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
