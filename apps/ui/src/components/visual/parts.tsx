import type { BoxValue } from './parseBoxes';
import { LIT, tagWidth } from './look';

// What the tree, the graph and the grid drawings share: the short word in a pill beside a node,
// the rows of values under the drawing and its line of code

export function Tag({ x, y, text }: { x: number; y: number; text: string }) {
  const width = tagWidth(text);
  return (
    <g data-tag={text}>
      <rect
        x={x - width / 2}
        y={y - 8}
        width={width}
        height={16}
        rx={8}
        style={{ fill: 'var(--bg2)', stroke: LIT }}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        style={{ fill: '#cdc6ff' }}
      >
        {text}
      </text>
    </g>
  );
}

export interface Row {
  label: string;
  values: BoxValue[];
  // The values to light up, by position in the row
  lit?: number[];
}

// Rows of values with their names, such as a queue or the visits so far. `count` is the most rows
// any step shows, so the drawing keeps its height from one step to the next
export function Rows({ rows, count }: { rows: Row[]; count: number }) {
  return (
    <div
      className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1.5 content-start font-mono text-[13px]"
      style={{ minHeight: `${count * 1.9}em` }}
    >
      {rows.map((row) => (
        <div key={row.label} data-row={row.label} className="contents">
          <span className="text-[var(--text3)]">{row.label}</span>
          <span className="flex flex-wrap gap-1">
            {row.values.length === 0 && <span className="text-[var(--text3)]">[ ]</span>}
            {row.values.map((value, i) => (
              <span
                key={i}
                data-lit={row.lit?.includes(i) || undefined}
                className={`min-w-[1.9em] px-1.5 py-0.5 text-center rounded-[var(--radius-sm)] border ${
                  row.lit?.includes(i)
                    ? 'bg-[rgba(108,92,231,0.25)] border-[var(--accent)] text-[#cdc6ff]'
                    : 'bg-[var(--glass)] border-[var(--border)] text-[var(--text)]'
                }`}
              >
                {value}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

// A line of code under the drawing, with its room kept on the steps that show none
export function CodeLine({ code }: { code: string | null }) {
  return (
    <div className="mt-3 min-h-[2.25em] flex justify-center">
      {code !== null && (
        <code
          data-code
          className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--glass)] border border-[var(--border)] font-mono text-[13px] text-[var(--text)] whitespace-pre-wrap break-words max-w-full"
        >
          {code}
        </code>
      )}
    </div>
  );
}
