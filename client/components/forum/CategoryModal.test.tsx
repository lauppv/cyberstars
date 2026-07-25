import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ForumCategoryDTO } from '../../../shared/forum';

const createCategory = vi.fn();
const updateCategory = vi.fn();
vi.mock('../../services/forumService', () => ({
  createCategory: (data: unknown) => createCategory(data),
  updateCategory: (slug: string, data: unknown) => updateCategory(slug, data),
}));

import { CategoryModal } from './CategoryModal';

const GROUPS = ['Help & Support', 'Off-Topic'];

const existing: ForumCategoryDTO = {
  id: 1,
  slug: 'help-python',
  name: 'Python Help',
  description: 'Ask about Python',
  icon: '🐍',
  color: '#6c5ce7',
  groupName: 'Help & Support',
  threadCount: 0,
  postCount: 0,
  lastPost: null,
};

function fill(name: string, description: string) {
  fireEvent.change(screen.getByPlaceholderText('e.g. Python Help'), { target: { value: name } });
  fireEvent.change(screen.getByPlaceholderText('What is this category about?'), {
    target: { value: description },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  createCategory.mockResolvedValue({ slug: 'rust-help' });
  updateCategory.mockResolvedValue({ ok: true });
});

describe('CategoryModal creation', () => {
  it('starts empty with sensible defaults and the first group preselected', () => {
    render(<CategoryModal groups={GROUPS} onClose={vi.fn()} onSaved={vi.fn()} />);

    expect(screen.getByText('New category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Python Help')).toHaveValue('');
    expect(screen.getByDisplayValue('💬')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeDisabled();
  });

  it('falls back to an empty group when none exist yet', () => {
    render(<CategoryModal groups={[]} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByPlaceholderText('e.g. Help & Support')).toHaveValue('');
  });

  it('keeps the submit button disabled while a required field is blank', () => {
    render(<CategoryModal groups={GROUPS} onClose={vi.fn()} onSaved={vi.fn()} />);

    fill('Rust Help', '   ');
    expect(screen.getByText('Create')).toBeDisabled();

    fill('Rust Help', 'Borrow checker woes');
    expect(screen.getByText('Create')).toBeEnabled();
  });

  it('creates the category with trimmed values and reports back', async () => {
    const onSaved = vi.fn();
    render(<CategoryModal groups={GROUPS} onClose={vi.fn()} onSaved={onSaved} />);

    fill('  Rust Help  ', '  Borrow checker woes  ');
    fireEvent.change(screen.getByDisplayValue('💬'), { target: { value: ' 🦀 ' } });
    fireEvent.change(screen.getByDisplayValue('Help & Support'), {
      target: { value: ' Languages ' },
    });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(onSaved).toHaveBeenCalledOnce());
    expect(createCategory).toHaveBeenCalledWith({
      name: 'Rust Help',
      description: 'Borrow checker woes',
      icon: '🦀',
      color: '#6C5CE7',
      groupName: 'Languages',
    });
  });
});

describe('CategoryModal editing', () => {
  it('prefills every field from the category being edited', () => {
    render(
      <CategoryModal category={existing} groups={GROUPS} onClose={vi.fn()} onSaved={vi.fn()} />,
    );

    expect(screen.getByText('Edit category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Python Help')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ask about Python')).toBeInTheDocument();
    expect(screen.getByDisplayValue('🐍')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#6c5ce7')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeEnabled();
  });

  it('updates the existing category by slug', async () => {
    const onSaved = vi.fn();
    render(
      <CategoryModal category={existing} groups={GROUPS} onClose={vi.fn()} onSaved={onSaved} />,
    );

    fireEvent.change(screen.getByDisplayValue('#6c5ce7'), { target: { value: '#00b894' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(onSaved).toHaveBeenCalledOnce());
    expect(updateCategory).toHaveBeenCalledWith(
      'help-python',
      expect.objectContaining({ name: 'Python Help', color: '#00b894' }),
    );
  });

  it('shows an error and re-enables the form when the save fails', async () => {
    updateCategory.mockRejectedValue(new Error('conflict'));
    const onSaved = vi.fn();
    render(
      <CategoryModal category={existing} groups={GROUPS} onClose={vi.fn()} onSaved={onSaved} />,
    );

    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Could not save the category. Try again.')).toBeInTheDocument();
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByText('Save')).toBeEnabled();
  });

  it('ignores a second submit while the first is still in flight', async () => {
    updateCategory.mockReturnValue(new Promise(() => {}));
    render(
      <CategoryModal category={existing} groups={GROUPS} onClose={vi.fn()} onSaved={vi.fn()} />,
    );

    fireEvent.click(screen.getByText('Save'));
    expect(await screen.findByText('Saving...')).toBeDisabled();

    fireEvent.click(screen.getByText('Saving...'));
    expect(updateCategory).toHaveBeenCalledOnce();
  });
});

describe('CategoryModal dismissal', () => {
  it('closes on the header button, the footer button and the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <CategoryModal groups={GROUPS} onClose={onClose} onSaved={vi.fn()} />,
    );

    fireEvent.click(screen.getByLabelText('Cancel'));
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.mouseDown(container.firstChild!);

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('stays open when the click lands inside the dialog', () => {
    const onClose = vi.fn();
    render(<CategoryModal groups={GROUPS} onClose={onClose} onSaved={vi.fn()} />);

    fireEvent.mouseDown(screen.getByPlaceholderText('e.g. Python Help'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on Escape and stops listening once unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <CategoryModal groups={GROUPS} onClose={onClose} onSaved={vi.fn()} />,
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
