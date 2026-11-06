// A page's title and one line on what it holds, over a faint purple glow
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="relative mb-7">
      <div
        className="page-glow pointer-events-none absolute inset-x-0 -top-8 h-36"
        aria-hidden="true"
      />
      <h1 className="relative text-2xl font-bold tracking-[-0.4px]">{title}</h1>
      <p className="relative mt-1.5 text-[14px] text-[var(--text2)] leading-relaxed max-w-xl">
        {subtitle}
      </p>
    </header>
  );
}
