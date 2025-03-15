import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import HookForm from './pages/home/form/HookForm';
import PlainForm from './pages/home/form/PlainForm';
import './App.css';
import Home from './pages/home/home';

function App() {
  const Layout = () => (
    <div>
      <Outlet />
    </div>
  );
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '/React2025Q1/forms/', element: <Home /> },
        {
          path: '/React2025Q1/forms/uncontrolled_form',
          element: <PlainForm />,
        },
        { path: '/React2025Q1/forms//hook_form', element: <HookForm /> },
        { path: '*', element: <h1>Not Found</h1> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
