import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  { id: 'all', em: '✦' },
  { id: 'history', em: '📜' },
  { id: 'oss', em: '🐧' },
  { id: 'legends', em: '👑' },
  { id: 'security', em: '🔒' },
  { id: 'hardware', em: '💾' },
  { id: 'internet', em: '🌐' },
  { id: 'space', em: '🪐' },
  { id: 'ai', em: '🧠' },
  { id: 'claude', em: '🟣' },
  { id: 'gemini', em: '🔵' },
  { id: 'chatgpt', em: '🟢' },
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
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
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
    fetchAlmanacIndex(lang)
      .then(setCards)
      .catch(() => setCards([]));
    fetchAlmanacExtras(lang)
      .then(setExtras)
      .catch(() => setExtras({ funFacts: [], quotes: [], timeline: [] }));
  }, [lang]);

  const handlePage = (p: number) => {
    setPage(p);
    document
      .querySelector('.almanac-articles')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openArticle = (slug: string) => {
    fetchAlmanacArticle(slug, lang)
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
          <div className="almanac-kicker">{t('almanac.kicker')}</div>
          <h1 className="almanac-title">
            {t('almanac.title')}
            <br />
            {t('almanac.titleLine2')}
          </h1>
          <p className="almanac-subtitle">{t('almanac.subtitle')}</p>
        </div>

        <div className="almanac-filters-bar">
          {!showAllTopics && (
            <button
              className="topic-nav"
              onClick={() => setTopicOffset((o) => (o - 1 + CATEGORIES.length) % CATEGORIES.length)}
              aria-label={t('almanac.prevTopics')}
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
                <span>{t(`almanac.categories.${c.id}`)}</span>
              </button>
            ))}
          </div>
          {!showAllTopics && (
            <button
              className="topic-nav"
              onClick={() => setTopicOffset((o) => (o + 1) % CATEGORIES.length)}
              aria-label={t('almanac.nextTopics')}
            >
              ›
            </button>
          )}
          <button className="topic-showall" onClick={() => setShowAllTopics((s) => !s)}>
            {showAllTopics ? t('almanac.carousel') : t('almanac.showAll')}
          </button>
        </div>

        {filter === 'all' && hero && (
          <article className="almanac-hero" onClick={() => openArticle(hero.slug)}>
            <div className="hero-art">
              <div className="hero-art-bg" />
              <div className="hero-art-stars" />
              <div className="hero-art-icon">{hero.emoji}</div>
              <div className="hero-art-badge">{t('almanac.featured')}</div>
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
              <h2>{t('almanac.latestReads')}</h2>
              <div className="meta">
                {filtered.length}{' '}
                {filter === 'all' ? t('almanac.articles') : t('almanac.inThisTopic')}
                {totalPages > 1 && (
                  <>
                    {' '}
                    · {t('almanac.page')} {page}/{totalPages}
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
                aria-label={t('almanac.prevFact')}
              >
                ‹
              </button>
              <button
                className="card-arrow card-arrow-right"
                onClick={nextFact}
                aria-label={t('almanac.nextFact')}
              >
                ›
              </button>
              <h3>{t('almanac.funFact')}</h3>
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
                aria-label={t('almanac.prevQuote')}
              >
                ‹
              </button>
              <button
                className="card-arrow card-arrow-right"
                onClick={nextQuote}
                aria-label={t('almanac.nextQuote')}
              >
                ›
              </button>
              <h3>{t('almanac.quotes')}</h3>
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
                {t('almanac.timelineKicker')}
              </div>
              <h2>{t('almanac.timelineTitle')}</h2>
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
