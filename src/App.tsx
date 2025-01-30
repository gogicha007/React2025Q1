import './App.css';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router';
import HomePage from './pages/home/home';
import NotFound from './pages/notfound/notfound';
import { Details, detailsLoader } from './components/details/details';
import ErrorBoundary from './components/errHandling/errBoundary';
import ErrFallbackComponent from './components/errHandling/fallbackRender';

function App() {
  const ErrorBoundaryLayout = () => (
    <ErrorBoundary fallback={<ErrFallbackComponent />}>
      <Outlet />
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

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />}>
//         <Route path=":id" element={<Details />} loader={detailsLoader} />
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

export default App;
