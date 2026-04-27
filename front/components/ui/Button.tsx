import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-[#c4638e] text-white hover:bg-[#7b9ec4] transition",
  outline: "border border-[#c4638e] text-[#d4c0ce] hover:bg-[#c4638e]/30 transition",
  danger: "bg-[#8b4a5e] text-[#e0ccd4] hover:bg-[#a0556b] transition",
  ghost: "bg-[#c4638e]/40 text-[#d4c0ce] hover:bg-[#7b9ec4]/40 transition shadow-md shadow-[#c4638e]/20",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded font-medium disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
