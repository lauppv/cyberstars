import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full border border-[var(--border)] px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg)] text-[var(--text)] text-sm placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition ${className}`}
        {...props}
      />
      {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
    </div>
  );
}
