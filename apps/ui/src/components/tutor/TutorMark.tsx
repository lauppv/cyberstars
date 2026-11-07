import { TutorFace, TutorFaceHappy, TutorFaceThinking } from './TutorFace';

export type TutorMood = 'idle' | 'thinking' | 'happy';

const FACES = { idle: TutorFace, thinking: TutorFaceThinking, happy: TutorFaceHappy };

// The tutor's mark, the sidebar's own face on an accent tint. The larger ones
// blink now and then while idle; the small one beside every answer keeps still,
// so a long conversation doesn't blink all at once. The small one beside the
// answer being written has an accent arc turning around it while it thinks
export function TutorMark({
  size,
  mood = 'idle',
}: {
  size: 'sm' | 'md' | 'lg' | 'xl';
  mood?: TutorMood;
}) {
  const box = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-10 h-10', xl: 'w-14 h-14' }[size];
  const Face = FACES[mood];
  return (
    <span
      aria-hidden="true"
      className={`${box} relative flex items-center justify-center flex-shrink-0 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] ${
        size !== 'sm' ? 'tutor-blink' : ''
      } ${size === 'sm' && mood === 'thinking' ? 'tutor-mark-thinking' : ''}`}
    >
      <Face size={{ sm: 14, md: 16, lg: 20, xl: 26 }[size]} strokeWidth={1.75} />
    </span>
  );
}
