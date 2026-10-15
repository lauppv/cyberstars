import { TutorFace, TutorFaceHappy, TutorFaceThinking } from './TutorFace';

export type TutorMood = 'idle' | 'thinking' | 'happy';

const FACES = { idle: TutorFace, thinking: TutorFaceThinking, happy: TutorFaceHappy };

// The tutor's mark, the sidebar's own face on an accent tint. The larger ones
// blink now and then while idle; the small one beside every answer keeps still,
// so a long conversation doesn't blink all at once
export function TutorMark({ size, mood = 'idle' }: { size: 'sm' | 'md' | 'lg'; mood?: TutorMood }) {
  const box = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-10 h-10' }[size];
  const Face = FACES[mood];
  return (
    <span
      aria-hidden="true"
      className={`${box} flex items-center justify-center flex-shrink-0 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] ${
        size !== 'sm' ? 'tutor-blink' : ''
      }`}
    >
      <Face size={{ sm: 14, md: 16, lg: 20 }[size]} strokeWidth={1.75} />
    </span>
  );
}
