import type { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// The two widths a page inside the app comes in: wide for grids, lists and
// dashboards, narrow for forms, settings and a single card. Both keep the same
// margins, so every page's title starts at the same place
const WIDTHS = {
  wide: 'max-w-[1040px]',
  narrow: 'max-w-[600px]',
} as const;

export function PageContainer({
  width = 'wide',
  className = '',
  children,
}: {
  width?: keyof typeof WIDTHS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <main className={`flex-1 w-full mx-auto px-4 sm:px-7 pt-8 pb-16 ${WIDTHS[width]} ${className}`}>
      {children}
    </main>
  );
}

// A whole page still loading: the topbar and the spinner in the middle
export function PageLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    </div>
  );
}
