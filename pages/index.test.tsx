import { screen, fireEvent } from '@testing-library/react';
import { setupStore } from '@/state/store';
import { mockData } from '@/utils/test-utils/mocks/mock_data';
import { IResponse, IQueryError } from '@/types/interface';
import { renderWithProviders } from '@/utils/test-utils/test-utils';
import Home from './index';

const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}));

const mockUseGetListQuery = jest.fn();
jest.mock('@/state/features/characters/charactersApiSlice', () => ({
  __esModule: true,
  ...jest.requireActual('@/state/features/characters/charactersApiSlice'),
  useGetListQuery: () => mockUseGetListQuery(),
}));

const mockUseCharacterFilters = jest.fn();
jest.mock('@/hooks/useCharacterFilter', () => ({
  useCharacterFilters: () => mockUseCharacterFilters(),
}));

const mockPush = jest.fn();

const setupMocks = ({
  data = null,
  isFetching = false,
  error = null,
  id = null,
}: {
  data: IResponse | null;
  isFetching: boolean;
  error: IQueryError | null;
  id: string | null;
}) => {
  mockUseRouter.mockReturnValue({ query: id ? { id } : {}, push: mockPush });
  mockUseCharacterFilters.mockReturnValue({
    page: '1',
    status: '',
    id: '',
    setFilters: jest.fn(),
  });
  mockUseGetListQuery.mockReturnValue({
    data,
    isFetching,
    error,
  });
};

describe('Home Page', () => {
  it('renders loading state', () => {
    setupMocks({ data: null, isFetching: true, error: null, id: null });
    renderWithProviders(<Home />, { store: setupStore() });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error state', () => {
    setupMocks({
      data: null,
      isFetching: false,
      error: { status: 404, data: { error: 'Not found' } },
      id: null,
    });
    renderWithProviders(<Home />, { store: setupStore() });
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders character list when data is available', () => {
    setupMocks({ data: mockData, isFetching: false, error: null, id: null });
    renderWithProviders(<Home />, { store: setupStore() });
    expect(screen.getByTestId('home__cardlist')).toBeInTheDocument();
  });

  it('handles list item click and updates URL', () => {
    setupMocks({ data: mockData, isFetching: false, error: null, id: '1' });
    renderWithProviders(<Home />, { store: setupStore() });
    fireEvent.click(screen.getByTestId('home__cardlist'));
    expect(mockPush).toHaveBeenCalled();
  });
});
