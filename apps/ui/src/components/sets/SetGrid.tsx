import type { ReactNode } from 'react';

// The cards of Courses, Algorithms and Projects: one column, two once the page
// has the room
export function SetGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">{children}</div>;
}
