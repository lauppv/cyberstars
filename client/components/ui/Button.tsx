import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:brightness-110 transition cursor-pointer",
  outline:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer",
  ghost:
    "bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer",
  danger:
    "bg-[var(--error)]/20 border border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/30 transition cursor-pointer",
  success:
    "bg-[var(--success)] text-black hover:brightness-110 transition cursor-pointer",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-5 py-2 rounded-[var(--radius-sm)] font-semibold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
