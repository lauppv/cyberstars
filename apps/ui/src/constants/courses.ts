import i18next, { type TFunction } from 'i18next';
import { baseLanguage } from '@cyberstars/shared/constants';

export interface CourseMeta {
  icon: string;
  color: string;
  label: string;
  langLabel: string;
}

const LANGUAGE_META: Record<string, CourseMeta> = {
  python: { icon: '🐍', color: '#3572A5', label: 'Python', langLabel: 'Python 3' },
  java: { icon: '☕', color: '#E76F00', label: 'Java', langLabel: 'Java' },
  c: { icon: '⚙️', color: '#A8B9CC', label: 'C', langLabel: 'C' },
  linux: { icon: '🐧', color: '#FCC624', label: 'Linux', langLabel: 'Bash' },
  // Taught in Python, Java and C, so its editor shows the one picked instead.
  'trees-graphs': {
    icon: '🌳',
    color: '#3FB950',
    label: 'Trees and Graphs',
    langLabel: 'Python · Java · C',
  },
  // Not built yet: the Courses page shows it as coming soon (COMING_SOON_COURSE_KEYS)
  web: {
    icon: '🌐',
    color: '#EC4899',
    label: 'Web Development',
    langLabel: 'HTML · CSS · JavaScript',
  },
};

// Courses announced on the Courses page before they have any lessons: a card
// that leads nowhere, with no route, seed row or progress behind it
export const COMING_SOON_COURSE_KEYS = ['web'] as const;

export function courseMeta(key: string): CourseMeta {
  return (
    LANGUAGE_META[baseLanguage(key)] ?? {
      icon: '📘',
      color: '#6C5CE7',
      label: key,
      langLabel: key.toUpperCase(),
    }
  );
}

// A soft corner of the course's colour, the wash its cards carry
export function courseWash(key: string): string {
  return `linear-gradient(135deg, ${courseMeta(key).color}26, transparent 60%)`;
}

// What a course or challenge set is about, in the page's language: a
// language's own name, or a topic such as Trees and Graphs translated.
export function courseLabel(key: string, t: TFunction = i18next.t): string {
  return t(`courses.names.${baseLanguage(key)}`, { defaultValue: courseMeta(key).label });
}

// A course's full name in the page's language, with a challenge set named as
// one ("Python Algorithms", "Algoritmi Python").
export function courseTitle(key: string, t: TFunction = i18next.t): string {
  const { label } = courseMeta(key);
  return t(`courses.names.${key}`, {
    defaultValue: key.startsWith('algo-') ? `${label} Algorithms` : label,
  });
}
