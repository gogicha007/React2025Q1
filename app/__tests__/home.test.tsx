import '@testing-library/jest-dom';
import { useGetListQuery } from '../../app/state/features/characters/charactersApiSlice';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { renderWithProviders } from '../../app/test_utils/test_utils';
import { setupStore } from '../../app/state/store';
import Home from '../../app/routes/home';
import { mockData } from '../../app/test_utils/mocks/mock-data';

jest.resetModules();
jest.mock('../../app/state/features/characters/charactersApiSlice', () => ({
  __esModule: true,
  ...jest.requireActual(
    '../../app/state/features/characters/charactersApiSlice'
  ),
  useGetListQuery: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe('Home Component', () => {
  test('renders Home component correctly', () => {
    (useGetListQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getAllByRole(`radio`).length).toBe(2);
  });

  test('displays Loader when fetching data', async () => {
    (useGetListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isFetching: true,
    });
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('displays error message on API error', async () => {
    (useGetListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: { status: '404 Not Found' },
      isLoading: false,
    });

    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    await waitFor(() => {
      expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    });
  });

  test('triggers search and updates params', async () => {
    (useGetListQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['?page=1&status=alive']}>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument();
    });
  });

  test('navigates back when clicking on the list', async () => {
    // mockNavigate.mockReset()

    renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Home />
      </MemoryRouter>,
      { store: setupStore() }
    );

    const listContainer = screen.getByTestId('home__cardlist');
    fireEvent.click(listContainer);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});