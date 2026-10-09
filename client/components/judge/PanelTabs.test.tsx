import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PanelTabs } from './PanelTabs';

const tabs = [
  { key: 'lesson' as const, label: 'Lesson' },
  { key: 'result' as const, label: 'Result' },
];

describe('PanelTabs', () => {
  it('marks the active tab and reports a pick', () => {
    const onSelect = vi.fn();
    render(<PanelTabs tabs={tabs} active="result" onSelect={onSelect} data-tour="tabs" />);
    expect(screen.getByRole('tab', { name: 'Result' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Lesson' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tablist')).toHaveAttribute('data-tour', 'tabs');
    fireEvent.click(screen.getByRole('tab', { name: 'Lesson' }));
    expect(onSelect).toHaveBeenCalledWith('lesson');
  });

  it('stretches the tabs across the bar when asked', () => {
    render(<PanelTabs tabs={tabs} active="lesson" onSelect={() => {}} fill />);
    expect(screen.getByRole('tab', { name: 'Lesson' }).className).toContain('flex-1');
  });
});
