// oneDark, the editor's own theme, so a still reads like the real editor
// without loading CodeMirror on the landing page
const KEYWORDS = new Set(['for', 'in', 'if', 'else']);
const BUILTINS = new Set(['print']);
const TOKEN = /(f?"[^"]*")|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(\s+|.)/g;

function color(token: string, kind: 'string' | 'number' | 'word' | 'other'): string | undefined {
  if (kind === 'string') return '#98c379';
  if (kind === 'number') return '#d19a66';
  if (kind === 'word' && KEYWORDS.has(token)) return '#c678dd';
  if (kind === 'word' && BUILTINS.has(token)) return '#61afef';
  return undefined;
}

function Line({ text }: { text: string }) {
  const parts = [...text.matchAll(TOKEN)].map((m, i) => {
    const kind = m[1] ? 'string' : m[2] ? 'number' : m[3] ? 'word' : 'other';
    const c = color(m[0], kind);
    return c ? (
      <span key={i} style={{ color: c }}>
        {m[0]}
      </span>
    ) : (
      m[0]
    );
  });
  return <>{parts}</>;
}

// A few lines of Python as the editor shows them: numbered, in the editor's
// colours. Too narrow a screen scrolls it sideways, as the editor would.
export function CodeStill({ code }: { code: string }) {
  return (
    <pre className="m-0 py-3 overflow-x-auto font-mono text-[10.5px] min-[400px]:text-[11px] sm:text-[12px] leading-[1.6] text-[#abb2bf]">
      {code.split('\n').map((line, i) => (
        <div key={i} className="flex">
          <span className="w-7 sm:w-9 pr-2 sm:pr-3 text-right text-[var(--text3)] select-none flex-shrink-0">
            {i + 1}
          </span>
          <span className="whitespace-pre">
            <Line text={line} />
          </span>
        </div>
      ))}
    </pre>
  );
}
