import { Details, detailsLoader } from '../components/details/details';
import HomePage from '../pages/home/home';
import NotFound from '../pages/notfound/notfound';

const routesConfig = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFound />,
    children: [
      {
        path: ':id',
        element: <Details />,
        loader: detailsLoader,
      },
    ],
  },
];

export default routesConfig;
