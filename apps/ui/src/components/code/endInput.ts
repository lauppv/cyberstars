import { createContext } from 'react';

// Whether a code cell's running program gets End input (Ctrl+D). A project's
// examples read until the input runs out, so its text gives it; a lesson's
// cells, where the student answers an input() or two, go without one, so the
// button can't be pressed in place of an answer.
export const EndInputContext = createContext(false);
