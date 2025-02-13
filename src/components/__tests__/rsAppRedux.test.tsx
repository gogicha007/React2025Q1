import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupStore } from '../../state/store';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router';
import { renderWithProviders } from '../../utils/test-utils/test-utils';
import Results from '../cardsList/cardsList';
import { Card } from '../card/card';
import HomePage from '../../pages/home/home';
import { Details } from '../details/details';
import { mockServer } from '../../utils/test-utils/mocks/mockServer';
import { http, HttpResponse } from 'msw';
import '@testing-library/jest-dom';
import { mockData, mockNoData } from '../../utils/test-utils/mocks/mock_data';

const server = mockServer();

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('rs-app-router-redux', () => {
  const setupRouter = (routes: RouteObject[], initialEntries: string[]) =>
    createMemoryRouter(routes, { initialEntries });

  test('renders the specified number of cards', async () => {
    const BASE_URL = 'https://rickandmortyapi.com/api/character';

    server.use(
      http.get(BASE_URL, async ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        const status = url.searchParams.get('status');

        console.log('Mock handler called:', {
          url: url.toString(),
          page,
          status,
        });

        if (page === '1' && status === 'alive') {
          return HttpResponse.json(mockData, { status: 200 });
        }

        return new HttpResponse(null, {
          status: 404,
          statusText: 'No matching mock for these parameters',
        });
      })
    );

    const router = setupRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      ['?page=1&status=alive']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      store: setupStore(),
    });

    await screen.findByRole('link', { name: /card 1 alive/i });
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(6);
    });
  });
  test('displays appropriate message if no cards are present', async () => {
    const BASE_URL = 'https://rickandmortyapi.com/api/character';

    server.use(
      http.get(BASE_URL, async ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        const status = url.searchParams.get('status');

        console.log('Mock handler called:', {
          url: url.toString(),
          page,
          status,
        });

        if (page === '1' && status === 'NODATA') {
          return HttpResponse.json(mockNoData, { status: 404 });
        }

        return new HttpResponse(null, {
          status: 404,
          statusText: 'No matching mock for these parameters',
        });
      })
    );

    const router = setupRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      ['?page=1&status=NODATA']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      store: setupStore(),
    });

    expect(await screen.findByRole('heading', { level: 3 })).toHaveTextContent(
      'No data fetched'
    );
  });
  test('renders relevant card data', async () => {
    renderWithProviders(<Card {...mockData.results[0]} />);
    expect(await screen.findByText(mockData.results[0].name)).toHaveTextContent(
      'card 1'
    );
  });
  test('clicking a card opens the detailed view', async () => {
    const BASE_URL = 'https://rickandmortyapi.com/api/character';

    server.use(
      http.get(BASE_URL, async ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        const status = url.searchParams.get('status');

        console.log('Mock handler called:', {
          url: url.toString(),
          page,
          status,
        });

        if (page === '1' && status === 'alive') {
          return HttpResponse.json(mockData, { status: 200 });
        }

        return new HttpResponse(null, {
          status: 404,
          statusText: 'No matching mock for these parameters',
        });
      })
    );

    const router = setupRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      ['?page=1&status=alive']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      store: setupStore(),
    });

    renderWithProviders(<RouterProvider router={router} />);

    const link = await screen.findAllByRole('link', { name: /card 1 alive/i });

    await userEvent.click(link[0]);

    await screen.findAllByRole('button', { name: /Close details/i });
    expect(await screen.findAllByText('Close details')).toBeInTheDocument();
  });
});
