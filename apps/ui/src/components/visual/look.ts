// How a node of a tree or a graph, or a cell of a grid, looks in each state, shared by the drawings

export const R = 15;
export const EDGE = 'var(--border)';
export const LIT = 'var(--accent)';

// A node being looked at is purple, one already dealt with green; a graph's vertex found but not
// dealt with yet has a purple ring
export const LOOK = {
  focused: { fill: 'rgba(108,92,231,0.25)', stroke: LIT, text: '#cdc6ff', width: 2 },
  seen: { fill: 'var(--glass)', stroke: LIT, text: 'var(--text)', width: 2 },
  done: { fill: 'rgba(59,167,118,0.25)', stroke: 'var(--success)', text: '#c4f0da', width: 2 },
  idle: { fill: 'var(--glass)', stroke: 'var(--border)', text: 'var(--text)', width: 1 },
};

export type NodeState = keyof typeof LOOK;

export const tagWidth = (text: string) => text.length * 6.2 + 10;
