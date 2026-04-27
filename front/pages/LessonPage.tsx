import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLesson } from "../hooks/useLesson";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../context/AuthContext";
import { fetchCurriculum } from "../services/lessonService";
import { Navbar } from "../components/layout/Navbar";
import { CodeEditor } from "../components/code/CodeEditor";
import { CodeOutput } from "../components/code/CodeOutput";
import { RunButton } from "../components/code/RunButton";
import { MarkdownRenderer } from "../components/markdown/MarkdownRenderer";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { LessonMeta } from "../types/curriculum";

export function LessonPage() {
  const navigate = useNavigate();
  const { category = "", lesson = "" } = useParams<{ category: string; lesson: string }>();
  const { isLoggedIn } = useAuth();

  const { title, content, codeTemplate, isLoading } = useLesson(category, lesson);
  const { output, isRunning, execute } = useCodeExecution();
  const { markComplete, saveCode } = useProgress(category);

  const [userCode, setUserCode] = useState("");
  const [lessonList, setLessonList] = useState<LessonMeta[]>([]);

  useEffect(() => {
    setUserCode(codeTemplate);
  }, [codeTemplate]);

  useEffect(() => {
    fetchCurriculum().then(courses => {
      const course = courses.find(c => c.key === category);
      if (course) setLessonList(course.lessons);
    }).catch(() => {});
  }, [category]);

  const currentIndex = lessonList.findIndex(l => l.slug === lesson);
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessonList.length - 1
    ? lessonList[currentIndex + 1] : null;

  const handleRun = useCallback(() => {
    execute(userCode, category);
  }, [execute, userCode, category]);

  const handleSave = useCallback(async () => {
    if (isLoggedIn) {
      await saveCode(lesson, userCode);
    }
  }, [isLoggedIn, saveCode, lesson, userCode]);

  const handleComplete = useCallback(async () => {
    if (isLoggedIn) {
      await markComplete(lesson);
    }
    if (nextLesson) {
      navigate(`/lesson/${category}/${nextLesson.slug}`);
    } else {
      navigate("/curriculum");
    }
  }, [isLoggedIn, markComplete, lesson, nextLesson, navigate, category]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[#0d1117] text-[#b0b8c5]">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#b0b8c5]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: lesson content */}
        <div className="w-1/2 p-6 overflow-auto bg-[#14181e] border-r border-[#1e2a38] h-full shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-[#5aa0e0]/80">{title}</h2>

          <MarkdownRenderer content={content} />

          <div className="flex gap-4 mt-4">
            <Button variant="ghost" onClick={() => navigate("/curriculum")}>
              Curriculum
            </Button>

            {prevLesson && (
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => navigate(`/lesson/${category}/${prevLesson.slug}`)}
              >
                Previous
              </Button>
            )}

            {nextLesson && (
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => navigate(`/lesson/${category}/${nextLesson.slug}`)}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Right: code editor */}
        <div className="w-1/2 flex flex-col p-6 bg-[#14181e] h-full overflow-hidden shadow-inner">
          <div className="flex-1 overflow-auto mb-2">
            <CodeEditor
              value={userCode}
              onChange={setUserCode}
              language={category}
              fontSize="24px"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <RunButton onClick={handleRun} isRunning={isRunning} />
            {isLoggedIn && (
              <>
                <Button variant="ghost" className="px-4 py-2" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="ghost" className="px-4 py-2" onClick={handleComplete}>
                  Complete Lesson
                </Button>
              </>
            )}
          </div>

          <CodeOutput output={output} />
        </div>
      </div>
    </div>
  );
}
