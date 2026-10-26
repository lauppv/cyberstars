import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { planetLessons } from '@cyberstars/shared/laniakea';
import { useCurriculum } from '../../context/CurriculumContext';

// Each planet's name, its lesson's title but for First steps, which also says
// the lessons it covers
export function usePlanetNames(courseKey: string | undefined): {
  titles: Map<string, string>;
  covers: Map<string, string>;
} {
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  return useMemo(() => {
    const course = courses.find((c) => c.key === courseKey);
    const lessons = course?.lessons ?? [];
    const names = new Map(lessons.map((l) => [l.slug, l.title]));
    const spans = new Map<string, string>();
    for (const p of planetLessons(lessons.map((l) => l.slug))) {
      if (p.lessons.length < 2) continue;
      names.set(p.slug, t('laniakea.firstSteps.name'));
      spans.set(p.slug, t('laniakea.firstSteps.covers', { count: p.lessons.length }));
    }
    return { titles: names, covers: spans };
  }, [courses, courseKey, t]);
}
