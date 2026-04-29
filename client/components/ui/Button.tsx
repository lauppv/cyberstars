import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-[#3580c0] text-[#e0e4ea] hover:bg-[#4090d0] transition",
  outline: "border border-[#2a4060] text-[#a8b0bc] hover:bg-[#2a4060]/40 transition",
  danger: "bg-[#3a2028] text-[#c0c5d0] hover:bg-[#4a2838] transition",
  ghost: "bg-[#1a2d45]/80 text-[#a8b0bc] hover:bg-[#253d58]/70 transition shadow-sm shadow-[#0d1117]/40",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded font-medium disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
