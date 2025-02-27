import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { setupStore } from '@/state/store';
import { characterApiSlice } from '@/state/features/characters/charactersApiSlice';

const store = setupStore()

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(characterApiSlice.util.invalidateTags(['Characters']));
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
