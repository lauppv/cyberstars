import { useMemo } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { PageContainer, PageLoading } from '../components/layout/PageContainer';
import { SetCard } from '../components/sets/SetCard';
import { SetDrawer } from '../components/sets/SetDrawer';
import { SetGrid } from '../components/sets/SetGrid';
import { SetRow } from '../components/sets/SetRow';
import { continueSlug } from '../components/sets/continueSlug';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { WEB_DEVELOPMENT, courseMeta, courseTitle } from '../constants/courses';
import {
  progressPct,
  xpForCourse,
  xpForLesson,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  WEB_COURSE_KEYS,
  CODE_LANGUAGES,
  isBeta,
  isMultiLanguage,
} from '@cyberstars/shared/constants';
import { canAccessFeature, PREVIEW_FEATURES } from '@cyberstars/shared/features';
import { LoadError } from '../components/ui/LoadError';

interface CourseData {
  key: string;
  icon: string;
  name: string;
  // The languages a multi-language course is taught in, as the card shows them.
  languages: string | null;
  beta: boolean;
  color: string;
  lessonCount: number;
  totalXp: number;
  progress: number;
  desc: string;
  chapters: { name: string; slug: string; sortOrder: number; xp: number; done: boolean }[];
  continueSlug?: string;
}

export function CoursesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const { courses: serverCourses, isLoading: curriculumLoading } = useCurriculum();
  const {
    progressMap,
    failedCourses,
    isLoading: progressLoading,
    refresh: refreshProgress,
  } = useAllProgress();
  // A course's syllabus is its own address, /courses/python, so it can be
  // linked and indexed. /courses?open=python is the old way to say it
  const { course: selectedKey } = useParams<{ course?: string }>();
  const [searchParams] = useSearchParams();
  const legacyOpen = searchParams.get('open');
  // While Web Development is in preview its card opens in production only for
  // admins and the founder (and for everyone in development); inside it, its
  // courses take the place of the others, and a web course's syllabus opens
  // over them
  const webOpen = canAccessFeature('webDevelopment', user?.role, import.meta.env.PROD);
  const inWeb =
    webOpen && (selectedKey === WEB_DEVELOPMENT || WEB_COURSE_KEYS.includes(selectedKey ?? ''));
  const openCourse = (key: string) => navigate(`/courses/${key}`);
  const closeCourse = () => navigate(inWeb ? `/courses/${WEB_DEVELOPMENT}` : '/courses');

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const allCourses: CourseData[] = useMemo(() => {
    const visibleKeys: readonly string[] = inWeb
      ? WEB_COURSE_KEYS
      : [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS];
    return serverCourses
      .filter((c) => visibleKeys.includes(c.key))
      .map((course) => {
        const p = progressMap[course.key];
        const doneSet = new Set((p?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug));
        return {
          key: course.key,
          icon: courseMeta(course.key).icon,
          name: course.title,
          languages: isMultiLanguage(course.key)
            ? CODE_LANGUAGES.map((language) => courseMeta(language).label).join(' · ')
            : null,
          beta: isBeta(course.key),
          color: courseMeta(course.key).color,
          lessonCount: course.lessons.length,
          totalXp: xpForCourse(course.lessons.length),
          progress: progressPct(p?.completed ?? 0, p?.total ?? course.lessons.length),
          desc: t(`courses.descriptions.${course.key}`, { defaultValue: course.description }),
          chapters: course.lessons.map((l) => ({
            name: l.title,
            slug: l.slug,
            sortOrder: l.sortOrder,
            xp: xpForLesson(l.sortOrder),
            done: doneSet.has(l.slug),
          })),
          continueSlug: continueSlug(course.lessons, p?.lessons),
        };
      });
  }, [serverCourses, progressMap, t, inWeb]);

  const syllabus = selectedKey ? allCourses.find((c) => c.key === selectedKey) : null;

  if (legacyOpen) return <Navigate to={`/courses/${legacyOpen}`} replace />;

  if (isLoading) return <PageLoading />;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar
        breadcrumb={
          inWeb ? { course: t('nav.courses'), lesson: courseTitle(WEB_DEVELOPMENT, t) } : undefined
        }
      />

      <PageContainer>
        {failedCourses.size > 0 && (
          <div className="mb-4">
            <LoadError text={t('progress.loadFailed')} onRetry={refreshProgress} />
          </div>
        )}
        <SetGrid>
          {allCourses.map((c) => (
            <SetCard
              key={c.key}
              setKey={c.key}
              title={c.name}
              subtitle={c.languages}
              beta={c.beta}
              badge={t('common.xpTotal', { xp: c.totalXp })}
              description={c.desc}
              count={{ n: c.lessonCount, noun: t('courses.lessons', { count: c.lessonCount }) }}
              progress={
                c.progress > 0
                  ? { pct: c.progress, label: t('courses.percentComplete', { pct: c.progress }) }
                  : undefined
              }
              onContinue={() => c.continueSlug && navigate(`/lesson/${c.key}/${c.continueSlug}`)}
              onOpen={() => openCourse(c.key)}
              openLabel={t('courses.viewSyllabus')}
            />
          ))}
          {!inWeb && (
            <SetCard
              setKey={WEB_DEVELOPMENT}
              title={courseTitle(WEB_DEVELOPMENT, t)}
              subtitle={courseMeta(WEB_DEVELOPMENT).langLabel}
              badge={PREVIEW_FEATURES.webDevelopment ? t('common.comingSoon') : undefined}
              badgeMuted
              description={t(`courses.descriptions.${WEB_DEVELOPMENT}`)}
              onOpen={webOpen ? () => openCourse(WEB_DEVELOPMENT) : undefined}
              openLabel={t('courses.viewCourses')}
              dimmed={PREVIEW_FEATURES.webDevelopment}
            />
          )}
        </SetGrid>
      </PageContainer>

      {syllabus && (
        <SetDrawer
          setKey={syllabus.key}
          title={syllabus.name}
          beta={syllabus.beta}
          meta={[
            {
              text: `${syllabus.lessonCount} ${t('courses.lessons', { count: syllabus.lessonCount })}`,
            },
            { text: t('common.xpTotal', { xp: syllabus.totalXp }), accent: true },
          ]}
          description={syllabus.desc}
          progress={
            syllabus.progress > 0
              ? {
                  pct: syllabus.progress,
                  label: t('courses.percentComplete', { pct: syllabus.progress }),
                }
              : undefined
          }
          label={t('courses.chapters')}
          onClose={closeCourse}
        >
          <CourseChapters course={syllabus} />
        </SetDrawer>
      )}
    </div>
  );
}

// A course's chapters in order on a track that fills as they are done, the
// next one to do ringed in the accent
function CourseChapters({ course }: { course: CourseData }) {
  const { t } = useTranslation();
  const total = course.chapters.length;
  const nextIdx = course.chapters.findIndex((ch) => !ch.done);
  const segs: { cls: string; top: number; height: number; delay: number }[] = [];
  for (let i = 0; i < total - 1; i++) {
    const a = course.chapters[i].done;
    const b = course.chapters[i + 1].done;
    segs.push({
      cls: a && b ? 'seg-filled' : a ? 'seg-half' : '',
      top: (i / (total - 1)) * 100,
      height: (1 / (total - 1)) * 100,
      delay: i,
    });
  }
  return (
    <div className="relative flex flex-col gap-0.5 pl-1">
      <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-[var(--bg3)] rounded-full pointer-events-none">
        {segs
          .filter((s) => s.cls)
          .map((s, k) => (
            <div
              key={k}
              className={`seg absolute left-0 right-0 rounded-full ${s.cls}`}
              style={{
                top: `${s.top}%`,
                height: `${s.height}%`,
                animationDelay: `${0.25 + s.delay * 0.08}s`,
              }}
            />
          ))}
      </div>
      {course.chapters.map((ch, i) => (
        <SetRow
          key={ch.slug}
          to={`/lesson/${course.key}/${ch.slug}`}
          number={i + 1}
          title={ch.name}
          done={ch.done}
          next={i === nextIdx}
          trailing={t('common.xpReward', { xp: ch.xp })}
          order={i}
        />
      ))}
    </div>
  );
}
