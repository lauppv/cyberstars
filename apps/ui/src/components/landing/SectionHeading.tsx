import type { ReactNode } from 'react';

// The heading every landing section opens on, so they read as one page
export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="max-w-[640px] mx-auto text-center mb-10 sm:mb-12">
      <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.4px] leading-[1.15] m-0 text-balance">
        {title}
      </h2>
      {children && (
        <p className="mt-3 mb-0 text-[15px] sm:text-[16px] text-[var(--text2)] leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}
