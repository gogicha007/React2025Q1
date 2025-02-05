import { render, screen, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
// import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/home/home';
import Results from './results';
import { Card } from '../card/card';
import { Details, detailsLoader } from '../details/details';
import { IFResponse } from '../../types/interface';
import { mockData } from '../../testing/mocks/mock_data';
import { mockFetch } from '../../testing/mocks/mock-fetch';
enableFetchMocks();

describe('rs-app-router', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Verify that the component renders the specified number of cards', async () => {
    window.fetch = mockFetch(mockData as IFResponse);
    render(
      <MemoryRouter initialEntries={['?page=1&status=Alive']}>
        <Results loader={true} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const results_list = screen.getAllByRole('link');
      expect(results_list.length).toBe(6);
    });
  });

  test('Check that an appropriate message is displayed if no cards are present', async () => {
    window.fetch = mockFetch(null);
    render(
      <MemoryRouter>
        <Results loader={true} />
      </MemoryRouter>
    );
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
          responseData = { description: 'Fetched details for item 1' };
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
});

// test('check if card link contains proper href', async () => {
//   window.fetch = mockFetch(mockData as IFResponse);
//   render(
//     <MemoryRouter initialEntries={['?page=1&status=Alive']}>
//       <Results loader={true} />
//     </MemoryRouter>
//   );
//   await waitFor(() => {
//     const listLinks: HTMLAnchorElement[] = screen.getAllByRole('link');
//     expect(listLinks[1].href).toContain('/2');
//   });
// });
