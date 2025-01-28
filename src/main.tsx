import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/errHandling/errBoundary.ts';
import ErrFallbackComponent from './components/errHandling/fallbackRender.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrFallbackComponent />}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
