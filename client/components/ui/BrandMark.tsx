import { SquareTerminal } from 'lucide-react';

// The CyberStars logo: a terminal glyph on an accent tile. Size is the tile's
// edge in px, the glyph scales with it
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center flex-shrink-0 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white"
      aria-hidden
    >
      <SquareTerminal size={Math.round(size * 0.58)} strokeWidth={2} />
    </span>
  );
}
