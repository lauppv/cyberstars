import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Runtime } from './Runtime';
import { formatMs } from './format';

describe('Runtime', () => {
  it('renders nothing without a runtime', () => {
    const { container } = render(<Runtime />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows both load-test times and says how much slower the student is', () => {
    render(<Runtime runtimeMs={30} referenceMs={19.5} />);
    expect(screen.getByText('Your code')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Our solution (not necessarily the fastest)')).toBeInTheDocument();
    expect(screen.getByText('19.5')).toBeInTheDocument();
    expect(screen.getByText('1.5× slower than our solution')).toBeInTheDocument();
  });

  it('says faster, or about as fast, the other way round', () => {
    const { unmount } = render(<Runtime runtimeMs={5} referenceMs={10} />);
    expect(screen.getByText('2× faster than our solution')).toBeInTheDocument();
    unmount();
    render(<Runtime runtimeMs={10.4} referenceMs={10} />);
    expect(screen.getByText('About as fast as our solution')).toBeInTheDocument();
  });

  it('skips the comparison when our solution took no measurable time', () => {
    render(<Runtime runtimeMs={3} referenceMs={0} />);
    expect(screen.getByText('Our solution (not necessarily the fastest)')).toBeInTheDocument();
    expect(screen.queryByText(/than our solution/)).not.toBeInTheDocument();
  });
});

describe('formatMs', () => {
  it('keeps three significant digits below 100 ms and whole ms above', () => {
    expect(formatMs(0.04213, 'en')).toBe('0.0421');
    expect(formatMs(2.2771, 'en')).toBe('2.28');
    expect(formatMs(45.36, 'en')).toBe('45.4');
    expect(formatMs(1438.5, 'en')).toBe('1,439');
    expect(formatMs(0, 'en')).toBe('0');
  });
});
