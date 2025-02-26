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
import {
  mockData,
  mockDataP2,
  //   mockNoData,
} from '../../utils/test-utils/mocks/mock_data';

const BASE_URL = 'https://rickandmortyapi.com/api/character';
const server = mockServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
const urlsObj = [
  { url: '?page=1&status=alive', response: mockData, status: 200 },
  { url: '?page=2&status=alive', response: mockDataP2, status: 200 },
];

describe('rs-app-router-redux', () => {
  const setupRouter = (routes: RouteObject[], initialEntries: string[]) =>
    createMemoryRouter(routes, { initialEntries });

  const mockApiResponse = (status = 200) => {
    server.use(
      http.get(BASE_URL, async ({ request }) => {
        const url = new URL(request.url);
        // console.log('Mock handler called:', { url: url.toString() });
        const mathedResponse = urlsObj.find(
          (entry) => url.search === entry.url
        );
        // console.log('matched url', mathedResponse?.response);
        return HttpResponse.json(mathedResponse?.response, { status });
      })
    );
  };

  test('renders the specified number of cards', async () => {
    mockApiResponse();
    const router = setupRouter(
      [{ path: '/', element: <Results loader /> }],
      ['?page=1&status=alive']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      store: setupStore(),
    });

    await screen.findByRole('link', { name: /card 1 alive/i });
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(6));
  });

  test('displays appropriate message if no cards are present', async () => {
    mockApiResponse(404);
    const router = setupRouter(
      [{ path: '/', element: <Results loader /> }],
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
    mockApiResponse();
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

    const links = await screen.findAllByRole('link', { name: /card 1 alive/i });
    await userEvent.click(links[0]);

    await screen.findByRole('button', { name: /Close details/i });
    expect(await screen.findByText('Close details')).toBeInTheDocument();
  });

  test('triggers API calls when clicking a card', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    mockApiResponse();
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

    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('/1') })
    );
    fetchSpy.mockRestore();
  });

  test('displays a loading indicator while fetching data', async () => {
    mockApiResponse();
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

    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    expect(screen.getAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );
  });

  test('clicking close button hides details component', async () => {
    mockApiResponse();
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

    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    await waitFor(() =>
      expect(screen.getByText('details 1')).toBeInTheDocument()
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Close details' })
    );
    await waitFor(
      () =>
        expect(
          screen.queryByRole('button', { name: 'Close details' })
        ).not.toBeInTheDocument(),
      { timeout: 2000 }
    );
  });

  test('pagination updates URL when page changes', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    mockApiResponse();
    const router = setupRouter(
      [{ path: '/', element: <HomePage /> }],
      ['?page=1&status=alive']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      store: setupStore(),
    });

    await userEvent.click(await screen.findByRole('button', { name: /»/i }));

    await screen.findByRole('link', { name: /card 7 alive/i });

    await waitFor(() =>
      expect(router.state.location.search).toContain('page=2')
    );

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('?page=2&status=alive'),
        })
      )
    );

    fetchSpy.mockRestore();
  });

  test('clicking search button saves value to Local Storage', async () => {
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    const router = setupRouter(
      [{ path: '/', element: <HomePage /> }],
      ['/?page=1']
    );
    renderWithProviders(<RouterProvider router={router} />);

    const input = await screen.findByRole('searchbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'dead');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(setItemMock).toHaveBeenCalledWith(expect.any(String), 'dead');
    setItemMock.mockRestore();
  });
  test('retrieves Local Storage value on mount', async () => {
    const getItemMock = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('dead');

    const router = setupRouter(
      [{ path: '/', element: <HomePage /> }],
      ['/?page=1']
    );
    renderWithProviders(<RouterProvider router={router} />);

    expect(getItemMock).toHaveBeenCalledWith('thisAppStorage');
    expect(await screen.findByRole('searchbox')).toHaveValue('dead');

    getItemMock.mockRestore();
  });
});
