import { useGraphics } from '../../hooks/useGraphics';

// One avatar for the whole app. When a person has no picture, min graphics show
// the first letter of their name over a flat surface — the same shape and
// weight as the image it stands in for, so a list of people never jumps between
// two looks. Max keeps the rocket it has always used.

interface AvatarProps {
  url: string | null | undefined;
  name?: string | null;
  /** Rendered box size in px. Font size and border scale from it. */
  size?: number;
  className?: string;
}

function initial(name: string | null | undefined): string {
  const ch = (name ?? '').trim().charAt(0);
  return ch ? ch.toUpperCase() : '?';
}

export function Avatar({ url, name, size = 40, className = '' }: AvatarProps) {
  const [graphics] = useGraphics();
  const box = { width: size, height: size };
  const ring = size >= 56 ? 'border-[3px]' : 'border-2';
  const base = `rounded-full flex-shrink-0 border-[var(--border)] ${ring} ${className}`;

  if (url) {
    return <img src={url} alt="" style={box} className={`${base} object-cover`} />;
  }
  return (
    <div
      style={{ ...box, fontSize: Math.round(size * (graphics === 'max' ? 0.5 : 0.4)) }}
      className={`${base} bg-[var(--surface2)] text-[var(--text2)] font-semibold flex items-center justify-center select-none`}
      aria-hidden
    >
      {graphics === 'max' ? '🚀' : initial(name)}
    </div>
  );
}
