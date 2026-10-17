// What a crawler, an AI answer engine or a link preview reads on a public
// page: the content as plain HTML with real links, no editor, no script. A
// browser that runs scripts never shows it (public/boot.js hides it before the
// first paint) and gets the app instead. The landing page is the exception:
// it's the app's own LandingPage, see scripts/prerender.tsx.
import i18n from 'i18next';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { remarkGreen } from '../components/markdown/remarkGreen';
import { twinPath } from '../i18n';
import type { Link, Page } from './pages';

function Links({ links }: { links: (Link & { description?: string })[] }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.path}>
          <a href={link.path}>{link.label}</a>
          {link.description && <p>{link.description}</p>}
        </li>
      ))}
    </ul>
  );
}

function Content({ page }: { page: Page }): ReactNode {
  const t = i18n.getFixedT(page.lang);
  const { view } = page;
  switch (view.kind) {
    case 'courses':
      return (
        <>
          <h1>{t('nav.courses')}</h1>
          <Links links={view.courses} />
        </>
      );
    case 'course':
      return (
        <>
          <h1>{view.name}</h1>
          <p>{view.description}</p>
          <h2>{t('courses.chapters')}</h2>
          <ol>
            {view.lessons.map((lesson) => (
              <li key={lesson.path}>
                <a href={lesson.path}>{lesson.label}</a>
              </li>
            ))}
          </ol>
        </>
      );
    case 'lesson':
      return (
        <>
          <h1>{view.title}</h1>
          {/* The app's MarkdownRenderer turns code into editors, which need a
              browser; here every example stays a plain code block */}
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkDirective, remarkGreen]}>
            {view.text}
          </ReactMarkdown>
          <nav>
            {view.previous && (
              <a href={view.previous.path} rel="prev">
                {t('lesson.previous')}: {view.previous.label}
              </a>
            )}{' '}
            {view.next && (
              <a href={view.next.path} rel="next">
                {t('lesson.next')}: {view.next.label}
              </a>
            )}
          </nav>
        </>
      );
    case 'algorithms':
      return (
        <>
          <h1>{t('nav.algorithms')}</h1>
          <Links links={view.courses} />
        </>
      );
    case 'challenges':
      return (
        <>
          <h1>{view.name}</h1>
          <p>{view.description}</p>
          <Links links={view.challenges} />
        </>
      );
    case 'almanac':
      return (
        <>
          <h1>{t('nav.almanac')}</h1>
          <Links links={view.articles} />
        </>
      );
    case 'article':
      return (
        <article>
          <h1>{view.article.title}</h1>
          {view.article.year && <p>{view.article.year}</p>}
          {view.article.fullText.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      );
    case 'landing':
      return null;
  }
}

export function StaticPage({ page }: { page: Page }) {
  const t = i18n.getFixedT(page.lang);
  const other = page.lang === 'en' ? 'ro' : 'en';
  const twin = page.alternates[other];
  return (
    <>
      <header>
        <a href={twinPath('/', page.lang)}>CyberStars</a>
        <nav>
          <a href={twinPath('/courses', page.lang)}>{t('nav.courses')}</a>{' '}
          <a href={twinPath('/algorithms', page.lang)}>{t('nav.algorithms')}</a>{' '}
          <a href={twinPath('/almanac', page.lang)}>{t('nav.almanac')}</a>
          {twin && (
            <>
              {' '}
              <a href={twin} hrefLang={other} lang={other}>
                {t(`lang.${other}`)}
              </a>
            </>
          )}
        </nav>
      </header>
      <main>
        {page.breadcrumb.length > 1 && (
          <nav aria-label={t('common.breadcrumb')}>
            <ol>
              {page.breadcrumb.slice(0, -1).map((link) => (
                <li key={link.path}>
                  <a href={link.path}>{link.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Content page={page} />
      </main>
    </>
  );
}
