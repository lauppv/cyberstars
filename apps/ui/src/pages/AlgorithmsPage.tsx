import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SearchX } from 'lucide-react';
import { Topbar } from '../components/layout/Topbar';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer, PageLoading } from '../components/layout/PageContainer';
import { SetCard } from '../components/sets/SetCard';
import { SetDrawer } from '../components/sets/SetDrawer';
import { SetGrid } from '../components/sets/SetGrid';
import { SetRow } from '../components/sets/SetRow';
import { continueSlug } from '../components/sets/continueSlug';
import { DifficultyFilters } from '../components/ui/DifficultyFilters';
import { type Difficulty, type DifficultyFilter } from '../constants/difficulty';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { courseLabel, courseTitle } from '../constants/courses';
import {
  ALGO_COURSE_KEYS,
  isBeta,
  progressPct,
  xpForCourse,
  xpForLesson,
} from '@cyberstars/shared/constants';
import type { Course } from '@cyberstars/shared/lesson';
import type { CourseProgress } from '@cyberstars/shared/progress';

function parseDifficulty(title: string): { diff: Difficulty; name: string } {
  const m = title.match(/^(Easy|Medium|Hard)\s*·\s*(.+)$/i);
  if (!m) return { diff: 'easy', name: title };
  return { diff: m[1].toLowerCase() as Difficulty, name: m[2] };
}

// A challenge set's address names its language: /algorithms/python
const langOf = (key: string) => key.replace(/^algo-/, '');

// A card per challenge set, as Courses has one per course; /algorithms/:lang
// opens that set's challenges in the drawer over them
export function AlgorithmsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const { isLoggedIn } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading } = useAllProgress();

  const sets = ALGO_COURSE_KEYS.map((key) => courses.find((c) => c.key === key)).filter(
    (c): c is Course => !!c,
  );
  const open = lang ? sets.find((c) => langOf(c.key) === lang) : undefined;
  const close = useCallback(() => navigate('/algorithms'), [navigate]);

  if (curriculumLoading || (isLoggedIn && progressLoading)) return <PageLoading />;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <PageContainer>
        <SetGrid>
          {sets.map((course) => {
            const progress = progressMap[course.key];
            const count = course.lessons.length;
            const pct = progress ? progressPct(progress.completed, progress.total) : 0;
            const next = continueSlug(course.lessons, progress?.lessons);
            return (
              <SetCard
                key={course.key}
                setKey={course.key}
                title={courseLabel(course.key, t)}
                beta={isBeta(course.key)}
                badge={t('common.xpTotal', { xp: xpForCourse(count) })}
                description={t(`algorithms.desc.${course.key}`)}
                count={{ n: count, noun: t('algoList.challengeNoun', { count }) }}
                progress={
                  progress && progress.completed > 0
                    ? {
                        pct,
                        label: t('progress.solved', {
                          done: progress.completed,
                          total: progress.total,
                        }),
                      }
                    : undefined
                }
                onContinue={() => next && navigate(`/lesson/${course.key}/${next}`)}
                onOpen={() => navigate(`/algorithms/${langOf(course.key)}`)}
                openLabel={t('algoList.viewChallenges')}
              />
            );
          })}
        </SetGrid>
      </PageContainer>

      {open && (
        <ChallengeDrawer
          key={open.key}
          course={open}
          progress={progressMap[open.key]}
          onClose={close}
        />
      )}
    </div>
  );
}

// A set's challenges with the difficulty filters over them
function ChallengeDrawer({
  course,
  progress,
  onClose,
}: {
  course: Course;
  progress: CourseProgress | undefined;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<DifficultyFilter>('all');

  const challenges = useMemo(() => {
    const solved = new Set((progress?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug));
    return course.lessons.map((l, i) => {
      const { diff, name } = parseDifficulty(l.title);
      return { ...l, number: i + 1, diff, name, done: solved.has(l.slug) };
    });
  }, [course, progress]);
  const shown = filter === 'all' ? challenges : challenges.filter((c) => c.diff === filter);
  const count = challenges.length;

  return (
    <SetDrawer
      setKey={course.key}
      title={courseTitle(course.key, t)}
      beta={isBeta(course.key)}
      meta={[
        { text: t('algoList.challenges', { count }) },
        { text: t('common.xpTotal', { xp: xpForCourse(count) }), accent: true },
      ]}
      description={t(`algorithms.desc.${course.key}`)}
      // Counted on the server, so a solved challenge that left the set still counts
      progress={
        progress && progress.completed > 0
          ? {
              pct: progressPct(progress.completed, progress.total),
              label: t('progress.solved', { done: progress.completed, total: progress.total }),
            }
          : undefined
      }
      label={t('algoList.challengesLabel')}
      toolbar={<DifficultyFilters value={filter} onChange={setFilter} />}
      onClose={onClose}
    >
      {shown.length === 0 ? (
        <EmptyState icon={SearchX} title={t('algoList.noMatch')} />
      ) : (
        <div className="flex flex-col gap-0.5 pl-1">
          {shown.map((c, i) => (
            <SetRow
              key={c.slug}
              to={`/lesson/${course.key}/${c.slug}`}
              number={c.number}
              title={c.name}
              done={c.done}
              difficulty={c.diff}
              trailing={c.hasTests ? t('common.xpReward', { xp: xpForLesson(c.sortOrder) }) : null}
              order={i}
            />
          ))}
        </div>
      )}
    </SetDrawer>
  );
}
