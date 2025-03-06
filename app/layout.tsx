import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'app/contexts/ThemeContext';
import ErrorBoundary from 'app/error-handling/ErrorBoundary';
import ErrorFallback from 'app/error-handling/ErrorFallbackComponent';
import { setupStore } from '../state/store';
import { characterApiSlice } from '../state/features/characters/charactersApiSlice';

const inter = Inter({ subsets: ['latin'] });

const store = setupStore();
store.dispatch(characterApiSlice.util.invalidateTags(['Characters']));

export const metadata = {
  title: 'Character Search',
  description: 'A Next.js application for searching characters',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundary fallback={<ErrorFallback />}>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}