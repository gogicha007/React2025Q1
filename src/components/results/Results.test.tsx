import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import Results from './results';
import { mockFetch } from '../../testing/mocks/mock-fetch';
import { IFResponse } from '../../types/interface';

const data = {
  info: {
    count: 200,
    next: 'https://rickandmortyapi.com/api/character/?page=2&status=Alive',
    pages: 15,
    prev: null,
  },
  results: [
    { id: 1, name: 'testing rick 1', status: 'alive' },
    { id: 2, name: 'testing rick 2', status: 'alive' },
    { id: 3, name: 'testing rick 3', status: 'alive' },
    { id: 4, name: 'testing rick 4', status: 'alive' },
    { id: 5, name: 'testing rick 5', status: 'alive' },
    { id: 6, name: 'testing rick 6', status: 'alive' },
  ],
};

describe('rs-app-router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('check number of cards listed', async () => {
    window.fetch = mockFetch(data as IFResponse);
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
    window.fetch = mockFetch(data as IFResponse);
    render(
      <MemoryRouter initialEntries={['?page=1&status=Alive']}>
        <Results loader={true} />
      </MemoryRouter>
    );
    await waitFor(() => {
      const links: HTMLAnchorElement[] = screen.getAllByRole('link');
      console.log(links[1].href);
      expect(links[1].href).toContain('/2');
    });
  });

  test('check if click on card navigates to details', async () => {
    window.fetch = mockFetch(data as IFResponse);
    render(
      <MemoryRouter initialEntries={['?page=1&status=Alive']}>
        <Results loader={true} />
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole('link')); // to be processed
    await waitFor(() => {
      // to be processed
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
