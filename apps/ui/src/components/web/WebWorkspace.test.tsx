import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { WEB_MAX_FILES, parseWebFiles, serializeWebFiles } from '@cyberstars/shared/webFiles';
import WebWorkspace from './WebWorkspace';

const SITE = serializeWebFiles([
  { path: 'index.html', content: '<h1>Station</h1><a href="crew.html">crew</a>' },
  { path: 'crew.html', content: '<h2>Crew</h2>' },
  { path: 'css/style.css', content: 'h1 {}' },
  { path: 'img/logo.png', content: '', image: true },
]);

// The lesson holds the text, as LessonPage does
function Lesson({ start = SITE, onText }: { start?: string; onText?: (text: string) => void }) {
  const [text, setText] = useState(start);
  return (
    <WebWorkspace
      value={text}
      onChange={(next) => {
        setText(next);
        onText?.(next);
      }}
      courseKey="web-dev"
      lessonSlug="first-page"
      onConsole={consoleSpy}
    />
  );
}

const consoleSpy = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

const paths = (text: string) => parseWebFiles(text).map((f) => f.path);

async function frame() {
  const iframe = await screen.findByTitle(/Preview of/);
  return iframe as HTMLIFrameElement;
}

// A message as the preview sends it, from the frame's window
function fromPreview(iframe: HTMLIFrameElement, data: Record<string, unknown>) {
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'cyberstars-preview', ...data },
        source: iframe.contentWindow,
      }),
    );
  });
}

describe('WebWorkspace', () => {
  it('lists the files, folders first, and opens index.html in a tab', () => {
    render(<Lesson />);
    const tree = screen.getAllByRole('listitem').map((li) => li.firstElementChild!.textContent);
    expect(tree.slice(0, 2)).toEqual(['css', 'style.css']);
    expect(screen.getByRole('tab', { name: 'index.html' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(document.querySelector('.cm-content')!.textContent).toContain('<h1>Station</h1>');
  });

  it('opens the first page once the files arrive after it mounted', () => {
    const props = { courseKey: 'web-dev', lessonSlug: 'first-page', onChange: vi.fn() };
    const { rerender } = render(<WebWorkspace value="" {...props} />);
    expect(screen.queryByRole('tab', { name: 'index.html' })).toBeNull();
    rerender(<WebWorkspace value={SITE} {...props} />);
    expect(screen.getByRole('tab', { name: 'index.html' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('makes a new file in the folder picked, and opens it', () => {
    const onText = vi.fn();
    render(<Lesson onText={onText} />);
    fireEvent.click(screen.getByRole('button', { name: 'css' }));
    fireEvent.click(screen.getByRole('button', { name: 'New file' }));
    const box = screen.getByRole('textbox', { name: /Name of the new file/ });
    expect(box).toHaveValue('css/');
    fireEvent.change(box, { target: { value: 'css/print.css' } });
    fireEvent.submit(box);
    expect(paths(onText.mock.calls[0][0])).toContain('css/print.css');
    expect(screen.getByRole('tab', { name: 'print.css' })).toHaveAttribute('aria-selected', 'true');
  });

  it('says why a name is refused and keeps the box open', () => {
    render(<Lesson />);
    fireEvent.click(screen.getByRole('button', { name: 'New file' }));
    const box = screen.getByRole('textbox', { name: /Name of the new file/ });
    fireEvent.change(box, { target: { value: 'index.html' } });
    fireEvent.submit(box);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Your site already has a file or folder there.',
    );
    fireEvent.change(box, { target: { value: 'notes' } });
    fireEvent.submit(box);
    expect(screen.getByRole('alert')).toHaveTextContent('end with .html, .css, .js, .json or .txt');
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(screen.queryByRole('textbox', { name: /Name of the new file/ })).toBeNull();
  });

  it('keeps a site to its number of files', () => {
    const full = serializeWebFiles(
      Array.from({ length: WEB_MAX_FILES }, (_, i) => ({ path: `p${i}.txt`, content: '' })),
    );
    render(<Lesson start={full} />);
    fireEvent.click(screen.getByRole('button', { name: 'New file' }));
    const box = screen.getByRole('textbox', { name: /Name of the new file/ });
    fireEvent.change(box, { target: { value: 'one-more.txt' } });
    fireEvent.submit(box);
    expect(screen.getByRole('alert')).toHaveTextContent(`at most ${WEB_MAX_FILES} files`);
  });

  it('renames a folder with its files, deletes a file, and closes the tabs that go', () => {
    const onText = vi.fn();
    render(<Lesson onText={onText} />);
    fireEvent.click(screen.getByRole('button', { name: 'style.css' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rename css' }));
    const box = screen.getByRole('textbox', { name: 'New name of css' });
    fireEvent.change(box, { target: { value: 'styles' } });
    fireEvent.submit(box);
    expect(paths(onText.mock.calls[0][0])).toContain('styles/style.css');
    expect(screen.getByRole('tab', { name: 'style.css' })).toHaveAttribute(
      'title',
      'styles/style.css',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete styles/style.css' }));
    expect(window.confirm).toHaveBeenCalledWith('Delete styles/style.css?');
    expect(paths(onText.mock.calls[1][0])).not.toContain('styles/style.css');
    expect(screen.queryByRole('tab', { name: 'style.css' })).toBeNull();
  });

  it("shows a lesson's image read-only, with no way to rename or delete it", () => {
    render(<Lesson />);
    fireEvent.click(screen.getByRole('button', { name: 'logo.png' }));
    expect(screen.getByRole('img', { name: 'img/logo.png' })).toHaveAttribute(
      'src',
      '/lessons/web-dev/assets/img/logo.png',
    );
    expect(screen.queryByRole('button', { name: 'Delete img/logo.png' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Rename img' })).toBeNull();
  });

  it('sends the page to the preview once it is ready, and only to it', async () => {
    render(<Lesson />);
    const iframe = await frame();
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts allow-forms allow-modals');
    const post = vi.spyOn(iframe.contentWindow!, 'postMessage');
    // From anywhere else, the same message does nothing
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', { data: { source: 'cyberstars-preview', type: 'runtime' } }),
      );
    });
    expect(post).not.toHaveBeenCalled();
    fromPreview(iframe, { type: 'runtime' });
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cyberstars-render',
        html: expect.stringContaining('Station'),
      }),
      '*',
    );
  });

  it('shows what the page says in the console, and gives it to the tutor', async () => {
    render(<Lesson />);
    const iframe = await frame();
    fromPreview(iframe, { type: 'console', level: 'warn', text: 'careful', file: 'a.js', line: 3 });
    fromPreview(iframe, { type: 'console', level: 'shout', text: 'nope' });
    fromPreview(iframe, { type: 'outsideLink', href: 'https://example.com' });
    fromPreview(iframe, { type: 'formSent', fields: 'name=Ana' });
    fromPreview(iframe, { type: 'navigate', path: 'nowhere.html' });
    const log = screen.getByRole('log', { name: 'Console' });
    expect(log).toHaveTextContent('careful');
    expect(log).toHaveTextContent('a.js:3');
    expect(log).not.toHaveTextContent('nope');
    expect(log).toHaveTextContent(
      "Links to other sites don't open in the preview: https://example.com",
    );
    expect(log).toHaveTextContent('The form was sent: name=Ana');
    expect(log).toHaveTextContent('There is no page nowhere.html in your site.');
    expect(consoleSpy).toHaveBeenLastCalledWith(expect.stringContaining('warn: careful (a.js:3)'));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(log).toHaveTextContent('What your page logs');
  });

  it('moves to the page a link leads to', async () => {
    render(<Lesson />);
    fromPreview(await frame(), { type: 'navigate', path: 'crew.html' });
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Page shown' })).toHaveValue('crew.html'),
    );
    await waitFor(() => expect(screen.getByTitle('Preview of crew.html')).toBeInTheDocument());
  });

  it('pauses after a loop that ran too long, until Run', async () => {
    render(<Lesson />);
    fromPreview(await frame(), { type: 'loop', file: 'index.html', line: 1 });
    expect(screen.getByRole('status')).toHaveTextContent('Paused: a loop ran too long');
    fireEvent.click(screen.getByRole('button', { name: /Run/ }));
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
  });

  it("keeps the page's localStorage for the lesson, and refuses what isn't storage", async () => {
    render(<Lesson />);
    const iframe = await frame();
    fromPreview(iframe, { type: 'storage', data: { theme: 'dark' } });
    expect(JSON.parse(localStorage.getItem('cyberstars.webStorage.web-dev/first-page')!)).toEqual({
      theme: 'dark',
    });
    fromPreview(iframe, { type: 'storage', data: { theme: 7 } });
    fromPreview(iframe, { type: 'storage', data: { big: 'x'.repeat(100_001) } });
    expect(JSON.parse(localStorage.getItem('cyberstars.webStorage.web-dev/first-page')!)).toEqual({
      theme: 'dark',
    });
  });

  it('says there is no page while the site has none', () => {
    render(<Lesson start={serializeWebFiles([{ path: 'a.css', content: '' }])} />);
    expect(screen.getByText(/Your site has no page yet/)).toBeInTheDocument();
  });
});
