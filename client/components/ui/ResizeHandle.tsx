interface Props {
  axis: 'x' | 'y';
  onPointerDown: (e: React.PointerEvent) => void;
  dragging?: boolean;
}

// Draggable divider between two panes. `x` sits between side-by-side panes
// (vertical bar, col-resize); `y` sits between stacked panes (horizontal bar,
// row-resize).
export function ResizeHandle({ axis, onPointerDown, dragging }: Props) {
  const axisClasses =
    axis === 'x' ? 'w-1.5 cursor-col-resize self-stretch' : 'h-1.5 cursor-row-resize w-full';
  return (
    <div
      role="separator"
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      onPointerDown={onPointerDown}
      className={`shrink-0 transition-colors hover:bg-[var(--accent)]/50 ${
        dragging ? 'bg-[var(--accent)]/60' : 'bg-[var(--accent)]/20'
      } ${axisClasses}`}
    />
  );
}
