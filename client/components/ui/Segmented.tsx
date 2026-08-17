// A small either/or control. Shared by the settings rows and by the graphics
// toggle on the public routes, so the two always read as the same control.
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  optionLabel,
  ariaLabel,
}: {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
  optionLabel: (opt: T) => string;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden"
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`px-3 py-1 text-[12px] font-semibold cursor-pointer border-none transition ${
              active
                ? 'bg-[var(--accent)] text-white'
                : 'bg-transparent text-[var(--text3)] hover:text-[var(--text)]'
            }`}
          >
            {optionLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}
