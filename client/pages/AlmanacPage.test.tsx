import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from 'i18next';
import type { AlmanacArticle } from '../../shared/almanac';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({ curriculum: [] }),
}));

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({ completedLessons: [] }),
}));

const { MOCK_INDEX, MOCK_EXTRAS } = vi.hoisted(() => {
  const hero = {
    slug: 'hero-story',
    cat: 'oss',
    catLabel: 'OPEN SOURCE',
    tag: 'OPEN SOURCE',
    title: 'Hero Story',
    excerpt: 'Hero excerpt',
    emoji: '🐧',
    date: 'May 2026',
    readTime: '8 min',
    author: 'Team',
    isHero: true,
  };
  const articles = Array.from({ length: 65 }, (_, i) => ({
    slug: `art-${i}`,
    cat: i === 0 ? 'security' : 'history',
    tag: i === 0 ? 'SECURITY' : 'HISTORY',
    year: `${1990 + i}`,
    emoji: '📦',
    grad: 'linear-gradient(135deg,#111,#222)',
    title: `Article ${i}`,
    excerpt: `Excerpt ${i}`,
    readTime: '5 min',
    author: 'Bot',
  }));
  return {
    MOCK_INDEX: [hero, ...articles],
    MOCK_EXTRAS: {
      funFacts: [
        { em: '🎲', text: 'Fact one', src: 'Src1' },
        { em: '🎯', text: 'Fact two', src: 'Src2' },
      ],
      quotes: [
        { text: 'Quote one', author: 'Author1' },
        { text: 'Quote two', author: 'Author2', context: 'ctx' },
      ],
      timeline: [{ emoji: '⏳', year: '1990', title: 'Moment', text: 'Timeline text', tag: 'TAG' }],
    },
  };
});

vi.mock('../services/almanacService', () => ({
  fetchAlmanacIndex: vi.fn(() => Promise.resolve(MOCK_INDEX)),
  fetchAlmanacExtras: vi.fn(() => Promise.resolve(MOCK_EXTRAS)),
  fetchAlmanacArticle: vi.fn((slug: string) =>
    Promise.resolve({
      ...MOCK_INDEX.find((c) => c.slug === slug)!,
      fullText: 'Body A\n\nBody B',
    }),
  ),
}));

// jsdom has no scrollIntoView; handlePage calls it on page change.
Element.prototype.scrollIntoView = vi.fn();

import { AlmanacPage } from './AlmanacPage';
import { StoryModal } from './StoryModal';
import { fetchAlmanacIndex, fetchAlmanacExtras } from '../services/almanacService';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('AlmanacPage', () => {
  // The language is a global i18n singleton; reset it so the ro test can't leak.
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('requests Romanian content when the UI language is ro', async () => {
    await i18n.changeLanguage('ro');
    renderWithRouter(<AlmanacPage />);
    await screen.findByText('Article 0');
    expect(vi.mocked(fetchAlmanacIndex)).toHaveBeenCalledWith('ro');
    expect(vi.mocked(fetchAlmanacExtras)).toHaveBeenCalledWith('ro');
  });

  it('renders the main heading and filters once loaded', async () => {
    renderWithRouter(<AlmanacPage />);
    expect(await screen.findByText(/The CyberStars Almanac/)).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders the hero section on "all" filter', async () => {
    renderWithRouter(<AlmanacPage />);
    expect(await screen.findByText('FEATURED STORY')).toBeInTheDocument();
  });

  it('renders without crashing when the data fails to load', async () => {
    vi.mocked(fetchAlmanacIndex).mockRejectedValueOnce(new Error('boom'));
    vi.mocked(fetchAlmanacExtras).mockRejectedValueOnce(new Error('boom'));
    renderWithRouter(<AlmanacPage />);
    expect(await screen.findByText(/The CyberStars Almanac/)).toBeInTheDocument();
    expect(screen.queryByText('FEATURED STORY')).not.toBeInTheDocument();
  });

  it('renders fun facts and quotes sidebar', async () => {
    renderWithRouter(<AlmanacPage />);
    expect(await screen.findByText(/Fun Fact/)).toBeInTheDocument();
    expect(screen.getByText(/Quotes/)).toBeInTheDocument();
  });

  it('renders the timeline section', async () => {
    renderWithRouter(<AlmanacPage />);
    expect(await screen.findByText(/The Timeline/)).toBeInTheDocument();
    expect(screen.getByText(/Moments that bent the trajectory/)).toBeInTheDocument();
  });

  it('filters articles when a category chip is clicked', async () => {
    renderWithRouter(<AlmanacPage />);
    await screen.findByText('FEATURED STORY');
    fireEvent.click(screen.getByText('Security'));
    expect(screen.queryByText('FEATURED STORY')).not.toBeInTheDocument();
  });

  it('paginates articles', async () => {
    renderWithRouter(<AlmanacPage />);
    await screen.findByText('FEATURED STORY');
    expect(screen.getByText('Article 0')).toBeInTheDocument();
    expect(screen.queryByText('Article 10')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Article 10')).toBeInTheDocument();
    expect(screen.queryByText('Article 0')).not.toBeInTheDocument();
    // Jump to the last page — covers the ellipsis and the disabled "next" arrow.
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByText('Article 64')).toBeInTheDocument();
  });

  it('navigates fun facts with arrows', async () => {
    renderWithRouter(<AlmanacPage />);
    const nextBtn = await screen.findByLabelText('Next fun fact');
    const prevBtn = screen.getByLabelText('Previous fun fact');
    const counterBefore = screen.getAllByText(/\/ /)[0].textContent;
    fireEvent.click(nextBtn);
    const counterAfter = screen.getAllByText(/\/ /)[0].textContent;
    expect(counterBefore).not.toBe(counterAfter);
    fireEvent.click(prevBtn);
  });

  it('navigates quotes with arrows', async () => {
    renderWithRouter(<AlmanacPage />);
    const nextBtn = await screen.findByLabelText('Next quote');
    fireEvent.click(nextBtn);
    fireEvent.click(screen.getByLabelText('Previous quote'));
  });

  it('opens story modal when an article is clicked', async () => {
    renderWithRouter(<AlmanacPage />);
    await screen.findByText('FEATURED STORY');
    const articles = document.querySelectorAll('.almanac-article');
    expect(articles.length).toBeGreaterThan(0);
    fireEvent.click(articles[0]);
    expect(await screen.findByText('✕')).toBeInTheDocument();
  });

  it('opens story modal when hero is clicked', async () => {
    renderWithRouter(<AlmanacPage />);
    const hero = await screen.findByText('FEATURED STORY');
    fireEvent.click(hero.closest('.almanac-hero')!);
    expect(await screen.findByText('✕')).toBeInTheDocument();
  });

  it('toggles show all topics', async () => {
    renderWithRouter(<AlmanacPage />);
    const toggleBtn = await screen.findByText('Show all');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Carousel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Carousel'));
    expect(screen.getByText('Show all')).toBeInTheDocument();
  });

  it('navigates topics with carousel arrows', async () => {
    renderWithRouter(<AlmanacPage />);
    const nextTopicBtn = await screen.findByLabelText('Next topics');
    const prevTopicBtn = screen.getByLabelText('Previous topics');
    fireEvent.click(nextTopicBtn);
    fireEvent.click(prevTopicBtn);
  });
});

describe('StoryModal', () => {
  const story: AlmanacArticle = {
    slug: 'test-story',
    cat: 'test',
    emoji: '🧪',
    tag: 'TEST',
    year: '2024',
    grad: 'linear-gradient(135deg,#000,#333)',
    title: 'Test Story',
    excerpt: 'A test',
    fullText: 'First paragraph\n\nSecond paragraph',
    author: 'Tester',
    readTime: '3 min',
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
