import { useTranslation } from 'react-i18next';
import { DIFF_COLORS, DIFF_FILTERS, type DifficultyFilter } from '../../constants/difficulty';

// All, Easy, Medium and Hard as pills, each in its difficulty's colour, as on
// a challenge list and a project list
export function DifficultyFilters({
  value,
  onChange,
}: {
  value: DifficultyFilter;
  onChange: (next: DifficultyFilter) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1.5">
      {DIFF_FILTERS.map((d) => {
        const isActive = value === d;
        const dc = d !== 'all' ? DIFF_COLORS[d] : null;
        const style = dc
          ? isActive
            ? {
                background: dc.bg,
                color: dc.text,
                border: `1px solid ${dc.text}`,
                boxShadow: `0 0 10px ${dc.bg}`,
              }
            : {
                background: 'transparent',
                color: dc.text,
                border: `1px solid ${dc.border}`,
              }
          : {
              background: isActive ? 'var(--surface2)' : 'var(--bg3)',
              color: isActive ? 'var(--text)' : 'var(--text3)',
              border: '1px solid transparent',
            };
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all"
            style={style}
          >
            {t(`algoList.filters.${d}`)}
          </button>
        );
      })}
    </div>
  );
}
