import { Image } from 'lucide-react';

// Where a screenshot of the app will go, at the size it will have. Until the
// picture exists the box names what belongs in it.
export function ScreenshotSlot({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="panel aspect-[16/10] w-full flex flex-col items-center justify-center gap-2 text-[var(--text3)]"
    >
      <Image size={24} strokeWidth={1.5} aria-hidden="true" />
      <span className="text-[13px] px-6 text-center">{label}</span>
    </div>
  );
}
