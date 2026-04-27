import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurriculum } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";
import * as progressService from "../services/progressService";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { PageContainer } from "../components/layout/PageContainer";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ProgressBar } from "../components/progress/ProgressBar";
import { LessonStatusBadge } from "../components/progress/LessonStatusBadge";
import type { Course } from "../types/curriculum";
import type { CourseProgress } from "../types/progress";

export function CurriculumPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCurriculum();
        setCourses(data);

        if (isLoggedIn) {
          const progressEntries = await Promise.all(
            data.map(async (course) => {
              try {
                const progress = await progressService.getCourseProgress(course.key);
                return [course.key, progress] as const;
              } catch {
                return null;
              }
            })
          );
          const map: Record<string, CourseProgress> = {};
          for (const entry of progressEntries) {
            if (entry) map[entry[0]] = entry[1];
          }
          setProgressMap(map);
        }
      } catch {
        // fallback handled by empty state
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-[#7b9ec4] mb-6">Hmm... let's see</h1>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {courses.map((course) => {
          const progress = progressMap[course.key];
          return (
            <div key={course.key} className="p-6 bg-[#221b33] rounded-lg shadow hover:shadow-lg transition border border-[#3d3458]">
              <h3 className="text-xl font-bold mb-2 text-[#d4789c]">{course.title}</h3>
              <p className="text-[#9b8fb5] mb-3">{course.description}</p>
              {progress && (
                <div className="mb-3">
                  <ProgressBar completed={progress.completed} total={progress.total} />
                </div>
              )}
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => setSelected(course)}
              >
                What will I learn?
              </Button>
            </div>
          );
        })}
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#7b9ec4]">{selected.title}</h2>
            <p className="text-[#9b8fb5] mb-4">{selected.description}</p>

            <ul className="list-none pl-2 text-[#c8bdd6] space-y-1">
              {selected.lessons.map((lesson) => {
                const progress = progressMap[selected.key];
                const lessonProgress = progress?.lessons.find(l => l.lessonSlug === lesson.slug);
                return (
                  <li
                    key={lesson.slug}
                    className="cursor-pointer hover:bg-[#7b9ec4]/15 px-2 py-1 rounded flex items-center gap-2"
                    onClick={() => {
                      setSelected(null);
                      navigate(`/lesson/${selected.key}/${lesson.slug}`);
                    }}
                  >
                    <LessonStatusBadge completed={lessonProgress?.completed ?? false} />
                    <span>{lesson.title}</span>
                  </li>
                );
              })}
            </ul>

            <Button
              variant="ghost"
              className="mt-6 px-4 py-2"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </>
        )}
      </Modal>

      <Button
        onClick={() => navigate("/")}
        className="mt-auto"
      >
        Home
      </Button>
    </PageContainer>
  );
}
