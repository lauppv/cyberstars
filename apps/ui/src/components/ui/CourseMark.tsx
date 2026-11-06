import { courseMeta } from '../../constants/courses';
import { courseGlyph } from '../gamification/courseGlyphs';

// The course's badge symbol on a tile of its colour, so every course is recognisable at a glance
export function CourseMark({ courseKey, size = 36 }: { courseKey: string; size?: number }) {
  const { color } = courseMeta(courseKey);
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0 rounded-[var(--radius)] border"
      style={{ width: size, height: size, background: `${color}1f`, borderColor: `${color}40` }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="-25 -25 50 50"
        color={color}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {courseGlyph(courseKey)}
      </svg>
    </span>
  );
}
