import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('names the page in its heading, with the line under it', () => {
    render(<PageHeader title="Courses" subtitle="Pick a language." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Courses' })).toBeInTheDocument();
    expect(screen.getByText('Pick a language.')).toBeInTheDocument();
  });
});
