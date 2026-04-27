import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <div>
      <input
        className={`w-full border border-[#6b5a8a] p-3 rounded bg-[#2a2240] text-[#c8bdd6] placeholder-[#7b6f96] focus:outline-none focus:border-[#c4638e] ${className}`}
        {...props}
      />
      {error && <p className="text-[#d4789c] text-sm mt-1">{error}</p>}
    </div>
  );
}
