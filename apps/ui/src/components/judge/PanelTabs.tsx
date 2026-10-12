import type { HTMLAttributes } from 'react';

export interface PanelTab<K extends string> {
  key: K;
  label: string;
}

interface PanelTabsProps<K extends string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  tabs: PanelTab<K>[];
  active: K;
  onSelect: (key: K) => void;
  // Stretch the tabs across the bar (the phone switcher) instead of packing
  // them at the start (the lesson panel's own bar).
  fill?: boolean;
}

export function PanelTabs<K extends string>({
  tabs,
  active,
  onSelect,
  fill = false,
  className = '',
  ...rest
}: PanelTabsProps<K>) {
  return (
    <div role="tablist" className={`flex border-b border-[var(--border)] ${className}`} {...rest}>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.key)}
            className={`${fill ? 'flex-1 py-3' : 'px-4 py-2.5'} text-[13px] font-semibold transition cursor-pointer bg-transparent border-b-2 -mb-px ${
              selected
                ? 'text-[var(--accent)] border-[var(--accent)]'
                : 'text-[var(--text3)] border-transparent hover:text-[var(--text2)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
