import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils/test-utils';
import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router';
import { useGetListQuery } from '../../state/characters/charactersApiSlice';
import Results from '../cardsList/cardsList';
import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

beforeAll(() => {
  enableFetchMocks();
});

// Mock API Slice
// jest.mock('../../state/characters/charactersApiSlice', () => ({
//   useGetListQuery: jest.fn(),
//   characterApiSlice: {
//     reducerPath: 'characterApi', // Mock the reducerPath here
//     reducer: (state = { results: [] }, action) => state, // Mock the reducer if necessary
//   },
//   middleware: jest.fn((getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(() => (next) => (action) => next(action))
//   ),
// }));

describe('Results Component', () => {
  it('renders the correct number of cards', async () => {
    const mockData = {
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          image: 'rick.png',
          species: 'Human',
          status: 'Alive',
        },
        {
          id: 2,
          name: 'Morty Smith',
          image: 'morty.png',
          species: 'Human',
          status: 'Alive',
        },
      ],
      info: { count: 2, pages: 1, next: null, prev: null },
    };

    (useGetListQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isFetching: false,
      error: null,
    });

    const setupRouter = (routes: RouteObject[], initialEntries: string[]) =>
      createMemoryRouter(routes, { initialEntries });

    const router = setupRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      ['?page=1&status=dead']
    );

    renderWithProviders(<RouterProvider router={router} />, {
      preloadedState: {},
    });

    // Ensure correct number of card elements are rendered
    const cards = await screen.findAllByRole('card');
    expect(cards).toHaveLength(2);
  });
});
