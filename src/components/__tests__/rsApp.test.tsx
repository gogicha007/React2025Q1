import { screen, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router';
import { renderWithProviders } from '../../utils/test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/home/home';
import Results from '../cardsList/cardsList';
import { Card } from '../card/card';
import { Details } from '../details/details';
import { IResponse } from '../../types/interface';
import {
  mockData,
  mockDataP2,
  mockDetails,
} from '../../utils/test-utils/mocks/mock_data';
import { mockFetch } from '../../utils/test-utils/mocks/mock-fetch';

beforeAll(() => {
  enableFetchMocks();
});

interface MockFetchConfig {
  url: string;
  response: unknown;
  status: number;
}

describe('rs-app-router', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  const setupRouter = (routes: RouteObject[], initialEntries: string[]) =>
    createMemoryRouter(routes, { initialEntries });

  const mockFetchImplementation = (endpoints: MockFetchConfig[]) => {
    return jest
      .spyOn(global, 'fetch')
      .mockImplementation(
        async (input: RequestInfo | URL): Promise<Response> => {
          const url = input.toString();
          const matchedEndpoint = endpoints.find((endpoint) =>
            url.includes(endpoint.url)
          );

          if (!matchedEndpoint) {
            throw new Error(`Unexpected fetch call: ${url}`);
          }

          return new Response(JSON.stringify(matchedEndpoint.response), {
            status: matchedEndpoint.status,
          });
        }
      );
  };

  test('renders the specified number of cards', async () => {
    jest.mock('../services/api', () => ({
      useGetDataQuery: jest.fn(() => ({ data: mockData, isLoading: false })),
    }));

    const router = setupRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      ['?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);
    await screen.findByRole('link', { name: /card 1 alive/i });
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(6);
    });
  });

  test('displays appropriate message if no cards are present', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockImplementation(
      async (): Promise<Response> =>
        new Response(JSON.stringify(mockData), { status: 404 })
    );
    const router = setupRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      ['?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { level: 3 })).toHaveTextContent(
      'no data fetched'
    );
    fetchSpy.mockRestore();
  });

  test('renders relevant card data', async () => {
    renderWithProviders(<Card {...mockData.results[0]} />);
    expect(await screen.findByText(mockData.results[0].name)).toHaveTextContent(
      'card 1'
    );
  });

  test('clicking a card opens the detailed view', async () => {
    window.fetch = mockFetch(mockData as IResponse);
    const router = setupRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      ['?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);

    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );
    expect(
      screen.getByRole('button', { name: 'Close details' })
    ).toBeInTheDocument();
  });

  test('triggers API calls when clicking a card', async () => {
    const fetchSpy = mockFetchImplementation([
      { url: '/?page=1&status=dead', response: mockData, status: 200 },
      { url: '/1', response: mockDetails, status: 200 },
    ]);

    const routes: RouteObject[] = [
      { path: '/', element: <HomePage /> },
      { path: '/:id', element: <Details /> },
    ];

    const router = setupRouter(routes, ['/?page=1&status=dead']);
    renderWithProviders(<RouterProvider router={router} />);

    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/1'));

    fetchSpy.mockRestore();
  });

  test('displays a loading indicator while fetching data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('?page=1&status=dead')) {
          responseData = mockData;
        } else if (url.includes('1')) {
          setTimeout(() => (responseData = mockDetails), 1000);
        } else {
          throw new Error('Unexpected fetch call');
        }
        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    const router = setupRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      ['/?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);
    screen.debug();
    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    expect(screen.getAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );

    fetchSpy.mockRestore();
  });

  test('detailed view displays correct data', async () => {
    const fetchSpy = mockFetchImplementation([
      { url: '/?page=1&status=dead', response: mockData, status: 200 },
      { url: '/1', response: mockDetails, status: 200 },
    ]);

    const router = setupRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      ['/?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);
    await userEvent.click(
      await screen.findByRole('link', { name: /card 1 alive/i })
    );

    await waitFor(() =>
      expect(screen.getByText('details 1')).toBeInTheDocument()
    );

    fetchSpy.mockRestore();
  });

  test('clicking close button hides details component', async () => {
    const fetchSpy = mockFetchImplementation([
      { url: '/?page=1&status=dead', response: mockData, status: 200 },
      { url: '/1', response: mockDetails, status: 200 },
    ]);
    const router = setupRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      ['/?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />);
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

    fetchSpy.mockRestore();
  });

  test('pagination updates URL when page changes', async () => {
    const fetchSpy = mockFetchImplementation([
      { url: '/?page=1&status=Alive', response: mockData, status: 200 },
      { url: '/?page=2&status=Alive', response: mockDataP2, status: 200 },
    ]);

    const router = setupRouter(
      [{ path: '/', element: <HomePage /> }],
      ['/?page=1&status=Alive']
    );

    renderWithProviders(<RouterProvider router={router} />);
    await userEvent.click(await screen.findByRole('button', { name: /»/i }));

    await screen.findByRole('link', { name: /card 7 alive/i });

    await waitFor(() =>
      expect(router.state.location.search).toContain('page=2')
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/?page=2&status=Alive')
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
