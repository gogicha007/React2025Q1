import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import StoreProvider from './StoreProvider';
import { ThemeProvider } from 'components/contexts/ThemeContext';
import ErrorBoundary from '../components/error-handling/ErrorBoundary';
import ErrorFallback from '../components/error-handling/ErrorFallbackComponent';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Character Search',
  description: 'A Next.js application for searching characters',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <ErrorBoundary fallback={<ErrorFallback />}>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
