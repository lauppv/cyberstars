import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';

// A page whose code can't be fetched (a deploy going on, or one that has
// replaced it) starts over: nginx's maintenance page, or the new build. Once a
// minute at most, so a chunk that's really gone can't spin the page
window.addEventListener('vite:preloadError', () => {
  try {
    if (Date.now() - Number(sessionStorage.getItem('cyberstars.chunkReload')) < 60_000) return;
    sessionStorage.setItem('cyberstars.chunkReload', String(Date.now()));
  } catch {
    return;
  }
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
