import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <div>
      <input
        className={`w-full border border-[#1e2a38] p-3 rounded bg-[#141a22] text-[#b0b8c5] placeholder-[#4a5565] focus:outline-none focus:border-[#4090d0] ${className}`}
        {...props}
      />
      {error && <p className="text-[#c08888] text-sm mt-1">{error}</p>}
    </div>
  );
}
