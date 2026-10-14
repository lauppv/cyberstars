import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router';

// The phone's panel covers the page, so a link it follows would open out of
// sight. There the panel steps aside; on a wider screen it stays beside the page.
const PHONE = '(max-width: 767px)';

// An in-app path changes the page without a reload; anything else opens in a
// new tab. Code stays plain code: an answer is something to read, not to run.
function components(onInAppLink: () => void): Components {
  return {
    a({ href, children }) {
      if (href?.startsWith('/') && !href.startsWith('//')) {
        return (
          <Link
            to={href}
            onClick={() => {
              if (window.matchMedia(PHONE).matches) onInAppLink();
            }}
          >
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  };
}

export function TutorAnswer({ text, onInAppLink }: { text: string; onInAppLink: () => void }) {
  return (
    <div className="tutor-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components(onInAppLink)}
        disallowedElements={['img']}
        unwrapDisallowed
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
