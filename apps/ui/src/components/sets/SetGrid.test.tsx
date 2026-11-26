import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetGrid } from './SetGrid';

function Grid({
  onOpen = () => {},
  remember,
  names = ['Python', 'C', 'Java'],
}: {
  onOpen?: (name: string) => void;
  remember?: string;
  names?: string[];
}) {
  return (
    <SetGrid remember={remember}>
      {names.map((name) => (
        <button key={name} onClick={() => onOpen(name)}>
          {name}
        </button>
      ))}
      {false}
    </SetGrid>
  );
}

const slots = () => screen.getAllByTestId('set-slot');
const front = () => slots().findIndex((s) => !s.firstElementChild!.hasAttribute('inert'));

describe('SetGrid', () => {
  beforeEach(() => localStorage.clear());

  it('starts on the first card, with the place shown', () => {
    render(<Grid />);
    expect(slots()).toHaveLength(3);
    expect(front()).toBe(0);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 of 3' })).toHaveAttribute('aria-current', 'true');
  });

  it('steps with Next and Previous, round the loop past either end', () => {
    render(<Grid />);
    const next = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(next);
    fireEvent.click(next);
    expect(front()).toBe(2);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    fireEvent.click(next);
    expect(front()).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(front()).toBe(2);
  });

  it('jumps to a card from its place in the row', () => {
    render(<Grid />);
    fireEvent.click(screen.getByRole('button', { name: '3 of 3' }));
    expect(front()).toBe(2);
  });

  it('brings a side card to the front instead of opening it', () => {
    const onOpen = vi.fn();
    render(<Grid onOpen={onOpen} />);
    fireEvent.click(slots()[1]);
    expect(front()).toBe(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('turns on a swipe, and the swipe opens nothing', () => {
    const onOpen = vi.fn();
    render(<Grid onOpen={onOpen} />);
    const card = screen.getByRole('button', { name: 'Python' });
    fireEvent.pointerDown(card, { clientX: 300 });
    fireEvent.pointerUp(card, { clientX: 200 });
    fireEvent.click(card);
    expect(front()).toBe(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('shows no controls for a single card', () => {
    render(
      <SetGrid>
        <div>Python</div>
      </SetGrid>,
    );
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });

  it('comes back to the card left in front', () => {
    const first = render(<Grid remember="courses" />);
    fireEvent.click(screen.getByRole('button', { name: '3 of 3' }));
    first.unmount();

    render(<Grid remember="courses" />);
    expect(front()).toBe(2);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('finds the card left in front by its key, not its place', () => {
    const first = render(<Grid remember="courses" />);
    fireEvent.click(screen.getByRole('button', { name: '2 of 3' }));
    first.unmount();

    render(<Grid remember="courses" names={['Go', 'Python', 'C', 'Java']} />);
    expect(front()).toBe(2);
  });

  it('starts on the first card when the one left is gone', () => {
    const first = render(<Grid remember="courses" />);
    fireEvent.click(screen.getByRole('button', { name: '3 of 3' }));
    first.unmount();

    render(<Grid remember="courses" names={['Python', 'C']} />);
    expect(front()).toBe(0);
  });

  it('keeps each row apart, and nothing without remember', () => {
    const first = render(<Grid remember="courses" />);
    fireEvent.click(screen.getByRole('button', { name: '3 of 3' }));
    first.unmount();

    const other = render(<Grid remember="projects" />);
    expect(front()).toBe(0);
    other.unmount();

    render(<Grid />);
    expect(front()).toBe(0);
  });
});
