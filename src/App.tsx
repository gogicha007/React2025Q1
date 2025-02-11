import './App.css';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router';
import HomePage from './pages/home/home';
import NotFound from './pages/notfound/notfound';
import { Details, detailsLoader } from './components/details/details';
import ErrorBoundary from './components/errHandling/errBoundary';
import ErrFallbackComponent from './components/errHandling/fallbackRender';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const ErrorBoundaryLayout = () => (
    <ErrorBoundary fallback={<ErrFallbackComponent />}>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </ErrorBoundary>
  );

  const router = createBrowserRouter([
    {
      element: <ErrorBoundaryLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
          children: [
            {
              path: ':id',
              element: <Details />,
              loader: detailsLoader,
            },
          ],
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
