import { BotMessageSquare } from 'lucide-react';

// The tutor's mark, the sidebar's own icon on an accent tint
export function TutorMark({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-10 h-10' }[size];
  return (
    <span
      aria-hidden="true"
      className={`${box} flex items-center justify-center flex-shrink-0 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]`}
    >
      <BotMessageSquare size={{ sm: 14, md: 16, lg: 20 }[size]} strokeWidth={1.75} />
    </span>
  );
}
