import { render, screen, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import Results from './results';
import { IFResponse } from '../../types/interface';
import { mockData } from '../../testing/mocks/mock_data';
import { mockFetch } from '../../testing/mocks/mock-fetch';
import HomePage from '../../pages/home/home';
import { Details } from '../details/details';
enableFetchMocks();

describe('rs-app-router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('check number of cards listed', async () => {
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

  test('check if no results provided', async () => {
    window.fetch = mockFetch(null);
    render(
      <MemoryRouter>
        <Results loader={true} />
      </MemoryRouter>
    );
    await waitFor(() => {
      const no_results = screen.getByRole('heading', { level: 3 });
      expect(no_results).toHaveTextContent('no data fetched');
    });
  });

  test('check if card link contains proper href', async () => {
    window.fetch = mockFetch(mockData as IFResponse);
    render(
      <MemoryRouter initialEntries={['?page=1&status=Alive']}>
        <Results loader={true} />
      </MemoryRouter>
    );
    await waitFor(() => {
      const listLinks: HTMLAnchorElement[] = screen.getAllByRole('link');
      expect(listLinks[1].href).toContain('/2');
    });
  });

  test('check if click on card navigates to details', async () => {
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

    await waitFor(() => screen.getAllByRole('link'));
    const card1 = screen.getByRole('link', { name: /card 1 alive/i });
    await userEvent.click(card1);
    expect(screen.getByRole('button', { name: 'Close details' }));
  });
});
