import { createContext } from 'react';
import type { RunLesson } from '@cyberstars/shared/lesson';

// The lesson a code cell's Run belongs to: Show Solution's cells run a
// challenge's solution, which may be only the function its hidden part calls.
// A lesson's own examples are whole programs and go without one.
export const RunLessonContext = createContext<RunLesson | null>(null);
