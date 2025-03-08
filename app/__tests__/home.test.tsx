import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  createMemoryRouter,
  RouterProvider,
  useLoaderData,
  useNavigation,
  useLocation,
  useNavigate,
} from 'react-router';
import { renderWithProviders } from '../test_utils/test_utils';
import Home from '../routes/home';
import { IResponse, IQueryError } from '../types/interface';
import { mockData } from '../test_utils/mocks/mock-data';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useLoaderData: jest.fn(),
  useNavigation: jest.fn(),
  useLocation: jest.fn(),
}));

const mockQueryError: IQueryError = {
  status: 404,
  data: { error: 'Character not found' },
};

const renderComponent = (
  data: IResponse | IQueryError,
  navigationState = 'idle',
  locationSearch = '',
  pathname = '/'
) => {
  (useLoaderData as jest.Mock).mockReturnValue(data);
  (useNavigation as jest.Mock).mockReturnValue({ state: navigationState });
  (useLocation as jest.Mock).mockReturnValue({
    search: locationSearch,
    pathname,
  });
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const routes = [
    {
      path: '/',
      element: <Home />,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  });

  return {
    ...renderWithProviders(<RouterProvider router={router} />),
    mockNavigate,
  };
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders Home component correctly with data', () => {
    renderComponent(mockData);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBe(2);
    expect(screen.getByTestId('home__cardlist')).toBeInTheDocument();
  });

  test('renders error message when data fetch fails', () => {
    renderComponent(mockQueryError);

    expect(
      screen.getByText(mockQueryError.status.toString())
    ).toBeInTheDocument();
  });

  test('displays loader when navigation state is loading', () => {
    renderComponent(mockData, 'loading');

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('handles search correctly', async () => {
    renderComponent(mockData);

    const searchBox = screen.getByRole('searchbox');
    fireEvent.change(searchBox, { target: { value: 'test' } });
    fireEvent.keyDown(searchBox, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toHaveValue('test');
    });
  });
  test('handles card click correctly', () => {
    const { mockNavigate } = renderComponent(
      mockData,
      'idle',
      '?page=1&status=',
      '/1'
    );

    const cardList = screen.getByTestId('home__cardlist');
    fireEvent.click(cardList);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
