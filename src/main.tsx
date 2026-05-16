import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against libraries trying to override fetch in some environments
// specifically to avoid "Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      Object.defineProperty(window, 'fetch', {
        get() { return originalFetch; },
        set() { console.warn('Something tried to override window.fetch, ignoring assignment to avoid TypeError.'); },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    console.warn('Could not set up fetch guard:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
