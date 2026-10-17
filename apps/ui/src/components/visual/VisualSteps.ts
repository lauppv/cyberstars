import { createContext } from 'react';

// The step each visual of the lesson on screen is on, by the visual's id, so a visual that comes
// back with the lesson's text in another programming language opens on the step the student left.
// The lesson page gives a new one to each lesson
export const VisualSteps = createContext<Map<string, number> | null>(null);
