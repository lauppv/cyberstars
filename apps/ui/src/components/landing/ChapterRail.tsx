import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CHAPTERS, currentChapter } from './chapters';
import { scrollToSection } from './scrollToSection';

// Linear's rail at the left edge of the page: a dash for each chapter, the
// one being read longer and brighter. Over the rail every chapter shows its
// name, and a click goes there. Only a wide window has room for it beside the
// content.
export function ChapterRail() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = CHAPTERS.map(([id]) => id);
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(currentChapter(ids, window.innerHeight));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav
      aria-label={t('landing.rail.label')}
      className="group/rail hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-1 py-3 pl-3 pr-5 rounded-[var(--radius)] hover:bg-[var(--popover)]/90 hover:backdrop-blur-sm transition-colors"
    >
      {CHAPTERS.map(([id, label]) => {
        const current = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            aria-current={current ? 'location' : undefined}
            className="group flex items-center gap-3 h-4 p-0 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="w-6 flex items-center" aria-hidden="true">
              <span
                className={`block h-[2px] rounded-full transition-all duration-300 ${
                  current
                    ? 'w-6 bg-[var(--text)]'
                    : 'w-3 bg-[var(--text3)] opacity-60 group-hover:opacity-100'
                }`}
              />
            </span>
            <span
              className={`text-[12px] whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover/rail:opacity-100 group-focus-visible:opacity-100 ${
                current
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text3)] group-hover:text-[var(--text2)]'
              }`}
            >
              {t(label)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
