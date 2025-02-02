import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import Results from './Results';
import { mockFetch } from '../../testing/mocks/mock-fetch';
import { IFResponse } from '../../types/interface';

const data = {
  info: {
    count: 200,
    next: 'https://rickandmortyapi.com/api/character/?page=2&status=Dead',
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
  test('results', async () => {
    window.fetch = mockFetch(data as IFResponse);
    render(
      // <BrowserRouter>
      <MemoryRouter initialEntries={['?page=1&status=Alive']}>
        <Results loader={true} />
      </MemoryRouter>
      // </BrowserRouter>
    );

    await waitFor(() => {
      // const noDataText = screen.getByRole('heading');
      // expect(noDataText).toBeInTheDocument();
      const results_list = screen.getAllByRole('link');
      expect(results_list).toBeInTheDocument();
    });
  });
});
