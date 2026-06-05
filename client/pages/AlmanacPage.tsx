import { useState, useEffect } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StoryModal } from './StoryModal';
import {
  fetchAlmanacIndex,
  fetchAlmanacExtras,
  fetchAlmanacArticle,
} from '../services/almanacService';
import type { AlmanacArticle, AlmanacCard, AlmanacExtras } from '../../shared/almanac';
import './AlmanacPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All', em: '✦' },
  { id: 'history', label: 'History', em: '📜' },
  { id: 'oss', label: 'Open Source', em: '🐧' },
  { id: 'legends', label: 'Legends', em: '👑' },
  { id: 'security', label: 'Security', em: '🔒' },
  { id: 'hardware', label: 'Hardware', em: '💾' },
  { id: 'internet', label: 'Internet', em: '🌐' },
  { id: 'space', label: 'Space', em: '🪐' },
  { id: 'ai', label: 'AI & Future', em: '🧠' },
  { id: 'claude', label: 'Claude', em: '🟣' },
  { id: 'gemini', label: 'Gemini', em: '🔵' },
  { id: 'chatgpt', label: 'ChatGPT', em: '🟢' },
];

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return (
    <nav className="almanac-pagination">
      <button className="pg-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
        ‹
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="pg-ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={'pg-btn' + (p === page ? ' pg-active' : '')}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ),
      )}
      <button className="pg-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
        ›
      </button>
    </nav>
  );
}

export function AlmanacPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [factIdx, setFactIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [openStory, setOpenStory] = useState<AlmanacArticle | null>(null);
  const [topicOffset, setTopicOffset] = useState(0);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [cards, setCards] = useState<AlmanacCard[] | null>(null);
  const [extras, setExtras] = useState<AlmanacExtras | null>(null);

  useEffect(() => {
    fetchAlmanacIndex()
      .then(setCards)
      .catch(() => setCards([]));
    fetchAlmanacExtras()
      .then(setExtras)
      .catch(() => setExtras({ funFacts: [], quotes: [], timeline: [] }));
  }, []);

  const handlePage = (p: number) => {
    setPage(p);
    document
      .querySelector('.almanac-articles')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openArticle = (slug: string) => {
    fetchAlmanacArticle(slug)
      .then(setOpenStory)
      .catch(() => {});
  };

  const visibleCategories = showAllTopics
    ? CATEGORIES
    : [...CATEGORIES.slice(topicOffset), ...CATEGORIES.slice(0, topicOffset)];

  if (!cards || !extras) {
    return (
      <>
        <Topbar />
        <main className="almanac-page">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        </main>
      </>
    );
  }

  const PER_PAGE = 10;
  const hero = cards.find((c) => c.isHero);
  const articleCards = cards.filter((c) => !c.isHero);
  const filtered = filter === 'all' ? articleCards : articleCards.filter((a) => a.cat === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const fact = extras.funFacts[factIdx];
  const quote = extras.quotes[quoteIdx];

  const nextFact = () => setFactIdx((factIdx + 1) % extras.funFacts.length);
  const prevFact = () =>
    setFactIdx((factIdx - 1 + extras.funFacts.length) % extras.funFacts.length);
  const nextQuote = () => setQuoteIdx((quoteIdx + 1) % extras.quotes.length);
  const prevQuote = () => setQuoteIdx((quoteIdx - 1 + extras.quotes.length) % extras.quotes.length);

  return (
    <>
      <Topbar />
      <main className="almanac-page">
        <div className="almanac-header">
          <div className="almanac-kicker">✦ The CyberStars Almanac</div>
          <h1 className="almanac-title">
            Tech stories, fun facts
            <br />
            &amp; everything in between.
          </h1>
          <p className="almanac-subtitle">
            Open-source legends and hacker culture, tech history, space, famous quotes, and the
            curious little fun facts behind the tools you use every day. New reads every week.
          </p>
        </div>

        <div className="almanac-filters-bar">
          {!showAllTopics && (
            <button
              className="topic-nav"
              onClick={() => setTopicOffset((o) => (o - 1 + CATEGORIES.length) % CATEGORIES.length)}
              aria-label="Previous topics"
            >
              ‹
            </button>
          )}
          <div className={'almanac-filters' + (showAllTopics ? ' show-all' : '')}>
            {visibleCategories.map((c) => (
              <button
                key={c.id}
                className={'almanac-chip' + (filter === c.id ? ' active' : '')}
                onClick={() => {
                  setFilter(c.id);
                  setPage(1);
                }}
              >
                <span className="chip-em">{c.em}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          {!showAllTopics && (
            <button
              className="topic-nav"
              onClick={() => setTopicOffset((o) => (o + 1) % CATEGORIES.length)}
              aria-label="Next topics"
            >
              ›
            </button>
          )}
          <button className="topic-showall" onClick={() => setShowAllTopics((s) => !s)}>
            {showAllTopics ? 'Carousel' : 'Show all'}
          </button>
        </div>

        {filter === 'all' && hero && (
          <article className="almanac-hero" onClick={() => openArticle(hero.slug)}>
            <div className="hero-art">
              <div className="hero-art-bg" />
              <div className="hero-art-stars" />
              <div className="hero-art-icon">{hero.emoji}</div>
              <div className="hero-art-badge">FEATURED STORY</div>
            </div>
            <div className="hero-content">
              <div className="hero-cat">✦ {hero.catLabel}</div>
              <h2 className="hero-title">{hero.title}</h2>
              <p className="hero-excerpt">{hero.excerpt}</p>
              <div className="hero-meta">
                <span>{hero.date}</span>
              </div>
            </div>
          </article>
        )}

        <div className="almanac-grid">
          <div>
            <div className="section-head">
              <h2>Latest reads</h2>
              <div className="meta">
                {filtered.length} {filter === 'all' ? 'articles' : 'in this topic'}
                {totalPages > 1 && (
                  <>
                    {' '}
                    · page {page}/{totalPages}
                  </>
                )}
              </div>
            </div>
            <div className="almanac-articles">
              {paginated.map((a, i) => (
                <article className="almanac-article" key={i} onClick={() => openArticle(a.slug)}>
                  <div className="article-art">
                    <div className="article-art-grad" style={{ background: a.grad }} />
                    <span className="article-art-tag">{a.tag}</span>
                    <span className="article-art-year">{a.year}</span>
                    <span className="emoji">{a.emoji}</span>
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{a.title}</h3>
                    <p className="article-excerpt">{a.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
            )}
          </div>

          <aside className="almanac-sidebar">
            <div className="side-card factcard">
              <button
                className="card-arrow card-arrow-left"
                onClick={prevFact}
                aria-label="Previous fun fact"
              >
                ‹
              </button>
              <button
                className="card-arrow card-arrow-right"
                onClick={nextFact}
                aria-label="Next fun fact"
              >
                ›
              </button>
              <h3>🎲 Fun Fact</h3>
              <span className="fact-emoji">{fact?.em}</span>
              <div className="fact-text">{fact?.text}</div>
              <div className="fact-source">{fact?.src}</div>
              <div className="card-counter">
                {factIdx + 1} / {extras.funFacts.length}
              </div>
            </div>

            <div className="side-card quote-card">
              <button
                className="card-arrow card-arrow-left"
                onClick={prevQuote}
                aria-label="Previous quote"
              >
                ‹
              </button>
              <button
                className="card-arrow card-arrow-right"
                onClick={nextQuote}
                aria-label="Next quote"
              >
                ›
              </button>
              <h3>💬 Quotes</h3>
              <div className="quote-mark">&ldquo;</div>
              <div className="quote-text">{quote?.text}</div>
              <div className="quote-author">
                — <strong>{quote?.author}</strong>
                {quote?.context && <> &middot; {quote.context}</>}
              </div>
              <div className="card-counter">
                {quoteIdx + 1} / {extras.quotes.length}
              </div>
            </div>
          </aside>
        </div>

        <section className="bigtl-section">
          <div className="section-head" style={{ marginBottom: 8 }}>
            <div>
              <div className="almanac-kicker" style={{ marginBottom: 6 }}>
                ⏳ The Timeline
              </div>
              <h2>Moments that bent the trajectory</h2>
            </div>
          </div>
          <div className="bigtl">
            {extras.timeline.map((m, i) => (
              <div className="bigtl-item" key={i}>
                <div className="bigtl-dot">{m.emoji}</div>
                <div className="bigtl-year">{m.year}</div>
                <h3 className="bigtl-title">{m.title}</h3>
                <p className="bigtl-text">{m.text}</p>
                <span className="bigtl-tag">{m.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {openStory && <StoryModal story={openStory} onClose={() => setOpenStory(null)} />}
    </>
  );
}
