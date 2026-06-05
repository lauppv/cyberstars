import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({ curriculum: [] }),
}));

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({ completedLessons: [] }),
}));

import { AlmanacPage } from './AlmanacPage';
import { StoryModal } from './StoryModal';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('AlmanacPage', () => {
  it('renders the main heading and filters', () => {
    renderWithRouter(<AlmanacPage />);
    expect(screen.getByText(/The CyberStars Almanac/)).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders the hero section on "all" filter', () => {
    renderWithRouter(<AlmanacPage />);
    expect(screen.getByText('FEATURED STORY')).toBeInTheDocument();
  });

  it('renders fun facts and quotes sidebar', () => {
    renderWithRouter(<AlmanacPage />);
    expect(screen.getByText(/Fun Fact/)).toBeInTheDocument();
    expect(screen.getByText(/Quotes/)).toBeInTheDocument();
  });

  it('renders the timeline section', () => {
    renderWithRouter(<AlmanacPage />);
    expect(screen.getByText(/The Timeline/)).toBeInTheDocument();
    expect(screen.getByText(/Moments that bent the trajectory/)).toBeInTheDocument();
  });

  it('filters articles when a category chip is clicked', () => {
    renderWithRouter(<AlmanacPage />);
    const securityChip = screen.getByText('Security');
    fireEvent.click(securityChip);
    expect(screen.queryByText('FEATURED STORY')).not.toBeInTheDocument();
  });

  it('navigates fun facts with arrows', () => {
    renderWithRouter(<AlmanacPage />);
    const nextBtn = screen.getByLabelText('Next fun fact');
    const prevBtn = screen.getByLabelText('Previous fun fact');
    const counterBefore = screen.getAllByText(/\/ /)[0].textContent;
    fireEvent.click(nextBtn);
    const counterAfter = screen.getAllByText(/\/ /)[0].textContent;
    expect(counterBefore).not.toBe(counterAfter);
    fireEvent.click(prevBtn);
  });

  it('navigates quotes with arrows', () => {
    renderWithRouter(<AlmanacPage />);
    const nextBtn = screen.getByLabelText('Next quote');
    fireEvent.click(nextBtn);
  });

  it('opens story modal when an article is clicked', () => {
    renderWithRouter(<AlmanacPage />);
    const articles = document.querySelectorAll('.almanac-article');
    if (articles.length > 0) {
      fireEvent.click(articles[0]);
      expect(screen.getByText('✕')).toBeInTheDocument();
    }
  });

  it('opens story modal when hero is clicked', () => {
    renderWithRouter(<AlmanacPage />);
    const hero = document.querySelector('.almanac-hero');
    if (hero) {
      fireEvent.click(hero);
      expect(screen.getByText('✕')).toBeInTheDocument();
    }
  });

  it('toggles show all topics', () => {
    renderWithRouter(<AlmanacPage />);
    const toggleBtn = screen.getByText('Show all');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Carousel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Carousel'));
    expect(screen.getByText('Show all')).toBeInTheDocument();
  });

  it('navigates topics with carousel arrows', () => {
    renderWithRouter(<AlmanacPage />);
    const nextTopicBtn = screen.getByLabelText('Next topics');
    const prevTopicBtn = screen.getByLabelText('Previous topics');
    fireEvent.click(nextTopicBtn);
    fireEvent.click(prevTopicBtn);
  });
});

describe('StoryModal', () => {
  const story = {
    emoji: '🧪',
    tag: 'TEST',
    year: '2024',
    grad: 'linear-gradient(135deg,#000,#333)',
    title: 'Test Story',
    excerpt: 'A test',
    fullText: 'First paragraph\n\nSecond paragraph',
    author: 'Tester',
    readTime: '3 min',
    xp: 10,
  };

  it('renders story content', () => {
    render(<StoryModal story={story} onClose={vi.fn()} />);
    expect(screen.getByText('Test Story')).toBeInTheDocument();
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<StoryModal story={story} onClose={onClose} />);
    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<StoryModal story={story} onClose={onClose} />);
    const overlay = document.querySelector('.story-overlay')!;
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<StoryModal story={story} onClose={onClose} />);
    const modal = document.querySelector('.story-modal')!;
    fireEvent.mouseDown(modal);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<StoryModal story={story} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
