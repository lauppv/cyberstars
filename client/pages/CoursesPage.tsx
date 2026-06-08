import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { courseMeta } from '../constants/courses';
import { progressPct, MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants';

interface CourseData {
  key: string;
  icon: string;
  name: string;
  color: string;
  lessonCount: number;
  progress: number;
  desc: string;
  chapters: { name: string; slug: string; sortOrder: number; done: boolean }[];
  firstSlug?: string;
}

export function CoursesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { courses: serverCourses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading } = useAllProgress();
  const [searchParams] = useSearchParams();
  const [selectedKey, setSelectedKey] = useState<string | null>(searchParams.get('open'));

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const allCourses: CourseData[] = useMemo(() => {
    const visibleKeys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS] as readonly string[];
    return serverCourses
      .filter((c) => visibleKeys.includes(c.key))
      .map((course) => {
        const p = progressMap[course.key];
        const doneSet = new Set((p?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug));
        return {
          key: course.key,
          icon: courseMeta(course.key).icon,
          name: course.title,
          color: courseMeta(course.key).color,
          lessonCount: course.lessons.length,
          progress: progressPct(p?.completed ?? 0, p?.total ?? course.lessons.length),
          desc: course.description,
          chapters: course.lessons.map((l) => ({
            name: l.title,
            slug: l.slug,
            sortOrder: l.sortOrder,
            done: doneSet.has(l.slug),
          })),
          firstSlug: course.lessons[0]?.slug,
        };
      });
  }, [serverCourses, progressMap]);

  const syllabus = selectedKey ? allCourses.find((c) => c.key === selectedKey) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[var(--text3)]">{t('common.loading')}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 max-w-[1040px] mx-auto w-full px-4 sm:px-7 py-8 pb-16">
        <div className="text-center mb-8 text-backdrop">
          <p className="text-[var(--text2)] text-sm">{t('courses.intro')}</p>
        </div>
        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCourses.map((c) => (
            <div
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className="bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border border-[var(--accent)]/30 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004]"
            >
              <div className="h-1.5 w-full" style={{ background: c.color }} />
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: c.color + '20' }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-base font-bold mb-0.5 flex items-center gap-2"
                      style={{ letterSpacing: '-0.2px' }}
                    >
                      {c.name}
                      {courseMeta(c.key).badge && (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            background: courseMeta(c.key).color + '30',
                            color: courseMeta(c.key).color,
                          }}
                        >
                          {courseMeta(c.key).badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-4">{c.desc}</p>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <span className="text-[11px] text-[var(--text3)]">
                    <strong className="text-[var(--text2)]">{c.lessonCount}</strong>{' '}
                    {t('courses.lessons', { count: c.lessonCount })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {c.progress > 0 ? (
                    <>
                      <div className="flex-1 mr-3">
                        <div className="text-[11px] text-[var(--text3)] mb-1">
                          {t('courses.percentComplete', { pct: c.progress })}
                        </div>
                        <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm transition-[width] duration-400"
                            style={{ width: `${c.progress}%`, background: c.color }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (c.firstSlug) {
                            navigate(`/lesson/${c.key}/${c.firstSlug}`);
                          }
                        }}
                        className="px-4 py-[7px] rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-xs font-semibold cursor-pointer border-none hover:brightness-110 transition flex-shrink-0"
                      >
                        {t('courses.continue')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKey(c.key);
                      }}
                      className="px-4 py-[7px] rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text)] text-xs font-semibold cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                    >
                      {t('courses.viewSyllabus')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Syllabus drawer */}
      {syllabus && (
        <>
          <div
            className="fixed inset-0 bg-black/65 z-[100] animate-fade-in"
            onClick={() => setSelectedKey(null)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-[var(--bg2)] border-l border-[var(--border)] overflow-y-auto z-[101]"
            style={{ animation: 'slideIn 0.3s cubic-bezier(.22,1,.36,1)' }}
          >
            <div className="flex items-start gap-3.5 p-6 pb-5 border-b border-[var(--border)]">
              <div
                className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] flex-shrink-0"
                style={{ background: syllabus.color + '20' }}
              >
                {syllabus.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold mb-1">{syllabus.name}</div>
                <div className="flex gap-3 text-xs text-[var(--text3)]">
                  <span>
                    {syllabus.lessonCount}{' '}
                    {t('courses.lessons', { count: syllabus.lessonCount })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition flex-shrink-0"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 text-[13px] text-[var(--text2)] leading-relaxed border-b border-[var(--border)]">
              {syllabus.desc}
            </div>

            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
                {t('courses.chapters')}
              </div>
              {(() => {
                const total = syllabus.chapters.length;
                const nextIdx = syllabus.chapters.findIndex((ch) => !ch.done);
                const segs: { cls: string; top: number; height: number; delay: number }[] = [];
                for (let i = 0; i < total - 1; i++) {
                  const a = syllabus.chapters[i].done;
                  const b = syllabus.chapters[i + 1].done;
                  let cls = '';
                  if (a && b) cls = 'seg-filled';
                  else if (a && !b) cls = 'seg-half';
                  segs.push({
                    cls,
                    top: (i / (total - 1)) * 100,
                    height: (1 / (total - 1)) * 100,
                    delay: i,
                  });
                }
                return (
                  <div className="relative flex flex-col gap-0.5 pl-1">
                    {/* Vertical track */}
                    <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-[var(--bg3)] rounded-full pointer-events-none">
                      {segs
                        .filter((s) => s.cls)
                        .map((s, k) => (
                          <div
                            key={k}
                            className={`absolute left-0 right-0 rounded-full origin-top ${s.cls}`}
                            style={{
                              top: `${s.top}%`,
                              height: `${s.height}%`,
                              animation: `segIn 0.45s cubic-bezier(.22,1,.36,1) ${0.25 + s.delay * 0.08}s forwards`,
                              transform: 'scaleY(0)',
                            }}
                          />
                        ))}
                    </div>
                    {/* Chapter items */}
                    {syllabus.chapters.map((ch, i) => {
                      const isNext = i === nextIdx;
                      return (
                        <div
                          key={i}
                          onClick={() => navigate(`/lesson/${syllabus.key}/${ch.slug}`)}
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition cursor-pointer ${isNext ? 'ch-is-next' : ''}`}
                          style={{
                            opacity: 0,
                            transform: 'translateX(-6px)',
                            animation: `chapterIn 0.45s cubic-bezier(.22,1,.36,1) ${0.05 + i * 0.04}s forwards`,
                          }}
                        >
                          <div
                            className={`relative z-[1] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 border-2 border-[var(--bg2)] transition-all ${
                              ch.done
                                ? 'bg-[var(--success)] text-white shadow-[0_0_0_2px_var(--bg2),0_0_12px_rgba(0,214,143,0.4)]'
                                : isNext
                                  ? 'bg-[var(--bg2)] text-[var(--accent)] border-[var(--accent)] ch-next-pulse'
                                  : 'bg-[var(--bg3)] text-[var(--text3)]'
                            }`}
                          >
                            {ch.done ? '✓' : i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-[13px] font-medium ${isNext ? 'text-[var(--accent)]' : ''}`}
                            >
                              {ch.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes segIn {
          to { transform: scaleY(1); }
        }
        @keyframes chapterIn {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes nextPulse {
          0%, 100% { box-shadow: 0 0 0 2px var(--bg2), 0 0 0 0 var(--accent-glow); }
          50% { box-shadow: 0 0 0 2px var(--bg2), 0 0 0 6px transparent, 0 0 16px var(--accent-glow); }
        }
        .seg-filled {
          background: linear-gradient(180deg, var(--success), var(--accent));
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .seg-half {
          background: linear-gradient(180deg, var(--success) 0%, var(--success) 45%, var(--bg3) 55%, var(--bg3) 100%);
        }
        .ch-next-pulse {
          animation: nextPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
