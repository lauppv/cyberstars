import type { Tone } from './crowns';

// A diagonal light-to-dark gradient, how every crown shows its metal and its stones
export function metalGradient(id: string, tone: Tone) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stopColor={tone.light} />
      <stop offset="0.5" stopColor={tone.mid} />
      <stop offset="1" stopColor={tone.dark} />
    </linearGradient>
  );
}
