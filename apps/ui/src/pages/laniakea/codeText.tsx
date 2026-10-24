import { Fragment, type ReactNode } from 'react';

// Words between backticks in a question show as code.
export function withCode(text: string): ReactNode {
  return text
    .split(/`([^`]+)`/)
    .map((part, i) =>
      i % 2 === 1 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
    );
}
