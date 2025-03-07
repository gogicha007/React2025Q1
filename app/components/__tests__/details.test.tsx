import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useGetDetailsQuery } from '../../state/characters/charactersApiSlice';
import '@testing-library/jest-dom';
import { Details } from '../details/details';

jest.mock('../../state/characters/charactersApiSlice', () => ({
  useGetDetailsQuery: jest.fn(),
}));

const mockUseOutletContext = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useOutletContext: () => mockUseOutletContext(),
}));

describe('Details Component', () => {
  const closeClickedMock = jest.fn();

  beforeEach(() => {
    mockUseOutletContext.mockReturnValue({
      closeClicked: closeClickedMock,
      counter: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (useGetDetailsQuery as jest.Mock).mockReturnValue({ isFetching: true });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useGetDetailsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      error: true,
    });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Error loading character details')
    ).toBeInTheDocument();
  });

  test('detailes view displays correct data', () => {
    (useGetDetailsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      data: {
        image: 'https://test-details.com/image.jpg',
        name: 'Character Name',
        origin: { name: 'Origin Name' },
        location: { name: 'Location Name' },
      },
    });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Character Name')).toBeInTheDocument();
    expect(screen.getByText('Origin Name')).toBeInTheDocument();
    expect(screen.getByText('Location Name')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://test-details.com/image.jpg'
    );
  });

  test('calls close function on button click', () => {
    (useGetDetailsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      data: {},
    });

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Close details'));
    expect(closeClickedMock).toHaveBeenCalled();
  });
});
