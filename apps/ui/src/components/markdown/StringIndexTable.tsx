interface StringIndexTableProps {
  text: string;
  highlight: number[];
  green?: number[];
}

// The green matches --success, the colour of the :green[...] text that points at the box
const PURPLE = {
  border: '#6C5CE7',
  background: 'rgba(108,92,231,0.25)',
  char: '#cdc6ff',
  label: '#9a8cff',
};
const GREEN = {
  border: '#3ba776',
  background: 'rgba(59,167,118,0.25)',
  char: '#c4f0da',
  label: '#3ba776',
};

export function StringIndexTable({ text, highlight, green = [] }: StringIndexTableProps) {
  const chars = [...text];
  const highlighted = new Set(highlight);
  const greened = new Set(green);

  return (
    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
      <div style={{ display: 'inline-flex', gap: '6px' }}>
        {chars.map((ch, i) => {
          const tone = greened.has(i) ? GREEN : highlighted.has(i) ? PURPLE : null;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <div
                style={{
                  minWidth: '34px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  borderRadius: '6px',
                  border: tone ? `2px solid ${tone.border}` : '1px solid rgba(108,92,231,0.3)',
                  background: tone ? tone.background : 'rgba(17,24,32,0.6)',
                  color: tone ? tone.char : '#e6e9ef',
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </div>
              <div
                style={{
                  marginTop: '4px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: tone ? tone.label : '#7a8290',
                }}
              >
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
