import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import { applyGraphics, effectiveGraphics } from './hooks/useGraphics';

// Stamp the graphics mode before the first paint, so the app never flashes the
// default look on its way to the stored one.
applyGraphics(effectiveGraphics());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
