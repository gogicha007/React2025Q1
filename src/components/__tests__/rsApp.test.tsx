import { render, screen, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { RouterProvider, createMemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/home/home';
import Results from '../cardsList/cardsList';
import { Card } from '../card/card';
import { Details, detailsLoader } from '../details/details';
import { IFResponse } from '../../types/interface';
import {
  mockData,
  mockDataP2,
  mockDetails,
} from '../../testing/mocks/mock_data';
import { mockFetch } from '../../testing/mocks/mock-fetch';
enableFetchMocks();

describe('rs-app-router', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Verify that the component renders the specified number of cards', async () => {
    window.fetch = mockFetch(mockData as IFResponse);
    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      const results_list = screen.getAllByRole('link');
      expect(results_list.length).toBe(6);
    });
  });

  test('Check that an appropriate message is displayed if no cards are present', async () => {
    window.fetch = mockFetch(null);
    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );
    render(<RouterProvider router={router} />);

    const noResults = await screen.findByRole('heading', { level: 3 });
    expect(noResults).toHaveTextContent('no data fetched');
  });

  test('Ensure that the card component renders the relevant card data', async () => {
    render(<Card {...mockData.results[0]} />);

    const name = await screen.findByText(mockData.results[0].name);
    expect(name.textContent).toEqual('card 1');
  });

  test('Clicking a card opens a detailed card component', async () => {
    window.fetch = mockFetch(mockData as IFResponse);
    const router = createMemoryRouter(
      [
        { path: '/', element: <HomePage /> },
        { path: '/:id', element: <Details /> },
      ],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => screen.findAllByRole('link'));
    const card1 = screen.getByRole('link', { name: /card 1 alive/i });
    await userEvent.click(card1);
    expect(
      screen.getByRole('button', { name: 'Close details' })
    ).toBeInTheDocument();
  });

  test('Triggers API call when clicking a card', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('/?page=1&status=dead')) {
          responseData = mockData;
        } else if (url.includes('/1')) {
          responseData = mockDetails;
        } else {
          throw new Error('Unexpected fetch call');
        }

        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    try {
      const router = createMemoryRouter(
        [
          { path: '/', element: <HomePage /> },
          { path: '/:id', element: <Details />, loader: detailsLoader },
        ],
        { initialEntries: ['/?page=1&status=dead'] }
      );

      render(<RouterProvider router={router} />);

      const card1 = await screen.findByRole('link', { name: /card 1 alive/i });
      await userEvent.click(card1);

      await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(3));
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/1'));
    } finally {
      fetchSpy.mockRestore();
    }
  });

  test('Check that a loading indicator is displayed while fetching data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('/?page=1&status=dead')) {
          responseData = mockData;
        } else if (url.includes('/1')) {
          setTimeout(() => (responseData = mockDetails), 1000);
        } else {
          throw new Error('Unexpected fetch call');
        }

        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    try {
      const router = createMemoryRouter(
        [
          { path: '/', element: <HomePage /> },
          { path: '/:id', element: <Details />, loader: detailsLoader },
        ],
        { initialEntries: ['/?page=1&status=dead'] }
      );

      render(<RouterProvider router={router} />);

      const card1 = await screen.findByRole('link', { name: /card 1 alive/i });
      await userEvent.click(card1);

      expect(screen.getAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
      );
    } finally {
      fetchSpy.mockRestore();
    }
  });
  test('Verify the detailed card component correctly displays the detailed card data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('/?page=1&status=dead')) {
          responseData = mockData;
        } else if (url.includes('/1')) {
          responseData = mockDetails;
        } else {
          throw new Error('Unexpected fetch call');
        }

        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    try {
      const router = createMemoryRouter(
        [
          { path: '/', element: <HomePage /> },
          { path: '/:id', element: <Details />, loader: detailsLoader },
        ],
        { initialEntries: ['/?page=1&status=dead'] }
      );

      render(<RouterProvider router={router} />);

      const card1 = await screen.findByRole('link', { name: /card 1 alive/i });
      await userEvent.click(card1);

      await waitFor(() =>
        expect(screen.getByText('details 1')).toBeInTheDocument()
      );
    } finally {
      fetchSpy.mockRestore();
    }
  });
  test('Verify if clicking the close button hides the detailes component', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('/?page=1&status=dead')) {
          responseData = mockData;
        } else if (url.includes('/1')) {
          responseData = mockDetails;
        } else {
          throw new Error('Unexpected fetch call');
        }

        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    try {
      const router = createMemoryRouter(
        [
          { path: '/', element: <HomePage /> },
          { path: '/:id', element: <Details />, loader: detailsLoader },
        ],
        { initialEntries: ['/?page=1&status=dead'] }
      );

      render(<RouterProvider router={router} />);

      const card1 = await screen.findByRole('link', { name: /card 1 alive/i });
      await userEvent.click(card1);

      await waitFor(() =>
        expect(screen.getByText('details 1')).toBeInTheDocument()
      );

      const closeBttn = await screen.findByRole('button', {
        name: 'Close details',
      });

      await userEvent.click(closeBttn);

      await waitFor(
        () =>
          expect(
            screen.queryByRole('button', { name: 'Close details' })
          ).not.toBeInTheDocument(),
        { timeout: 2000 }
      );
    } finally {
      fetchSpy.mockRestore();
    }
  });

  test('Verify Pagination updates URL query when page changes', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url = input.toString();
        let responseData;

        if (url.includes('/?page=1&status=Alive')) {
          responseData = mockData;
        } else if (url.includes('/?page=2&status=Alive')) {
          responseData = mockDataP2;
        } else {
          throw new Error('Unexpected fetch call');
        }

        return new Response(JSON.stringify(responseData), { status: 200 });
      }
    );

    try {
      const router = createMemoryRouter(
        [{ path: '/', element: <HomePage /> }],
        { initialEntries: ['/?page=1&status=Alive'], initialIndex: 0 }
      );

      render(<RouterProvider router={router} />);

      const nextBttn = await screen.findByRole('button', { name: /»/i });
      await userEvent.click(nextBttn);

      await screen.findByRole('link', { name: /card 7 alive/i });

      await waitFor(() => {
        expect(router.state.location.search).toContain('page=2');
      });
      await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
      await waitFor(() =>
        expect(fetchSpy).toHaveBeenCalledWith(
          expect.stringContaining('/?page=2&status=Alive')
        )
      );
    } finally {
      fetchSpy.mockRestore();
    }
  });
  test('Verify clicking the Search button saves the value to the Local Storage', async () => {
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    const router = createMemoryRouter([{ path: '/', element: <HomePage /> }], {
      initialEntries: ['/?page=1'],
    });

    render(<RouterProvider router={router} />);

    const input = await screen.findByRole('searchbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'dead');

    const searchBttn = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchBttn);

    expect(setItemMock).toHaveBeenCalledWith(expect.any(String), 'dead');

    setItemMock.mockRestore();
  });

  test('Verify Local Storage retrieval on mount', async () => {
    const getItemMock = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('dead');

    const router = createMemoryRouter([{ path: '/', element: <HomePage /> }], {
      initialEntries: ['/?page=1'],
    });

    render(<RouterProvider router={router} />);

    expect(getItemMock).toHaveBeenCalledWith('thisAppStorage');

    const input = await screen.findByRole('searchbox');
    expect(input).toHaveValue('dead');

    getItemMock.mockRestore();
  });
});
