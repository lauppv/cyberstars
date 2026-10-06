// The CyberStars logo: the accent star from favicon.svg. Size is its edge in px
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="flex-shrink-0" aria-hidden>
      <polygon
        points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
        fill="var(--accent)"
      />
    </svg>
  );
}
