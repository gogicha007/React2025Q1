import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/error-handling/ErrorBoundary';
import ErrorFallback from '@/components/error-handling/ErrorFallbackComponent';
import { setupStore } from '@/state/store';
import { characterApiSlice } from '@/state/features/characters/charactersApiSlice';

const store = setupStore();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(characterApiSlice.util.invalidateTags(['Characters']));
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary fallback={<ErrorFallback/>}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}
