interface StringIndexTableProps {
  text: string;
  highlight: number[];
}

export function StringIndexTable({ text, highlight }: StringIndexTableProps) {
  const chars = [...text];
  const highlighted = new Set(highlight);

  return (
    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
      <div style={{ display: 'inline-flex', gap: '6px' }}>
        {chars.map((ch, i) => {
          const on = highlighted.has(i);
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
                  border: on ? '2px solid #6C5CE7' : '1px solid rgba(108,92,231,0.3)',
                  background: on ? 'rgba(108,92,231,0.25)' : 'rgba(17,24,32,0.6)',
                  color: on ? '#cdc6ff' : '#e6e9ef',
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </div>
              <div
                style={{
                  marginTop: '4px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: on ? '#9a8cff' : '#7a8290',
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
