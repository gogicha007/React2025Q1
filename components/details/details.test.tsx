import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useGetDetailsQuery } from '../../state/features/characters/charactersApiSlice';
import Details from './Details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../state/features/characters/charactersApiSlice', () => ({
  useGetDetailsQuery: jest.fn(),
}));

jest.mock('../loader/loader', () => {
  return {
    __esModule: true,
    default: () => <div>Loading...</div>,
  };
});

describe('Details Component', () => {
  const mockPush = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseGetDetailsQuery = useGetDetailsQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      query: { id: '1' },
      push: mockPush,
    });

    mockUseGetDetailsQuery.mockReturnValue({
      data: {
        image: 'https://example.com/image.jpg',
        name: 'Character Name',
        origin: { name: 'Origin Name' },
        location: { name: 'Location Name' },
      },
      isFetching: false,
      error: null,
    });
  });

  test('renders loading state correctly', () => {
    mockUseGetDetailsQuery.mockReturnValueOnce({
      data: null,
      isFetching: true,
      error: null,
    });

    render(<Details />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    mockUseGetDetailsQuery.mockReturnValueOnce({
      data: null,
      isFetching: false,
      error: true,
    });

    render(<Details />);

    expect(screen.getByText('Error loading character details')).toBeInTheDocument();
  });

  test('renders character details correctly', () => {
    render(<Details />);

    expect(screen.getByAltText('image')).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(screen.getByText('Character Name')).toBeInTheDocument();
    expect(screen.getByText('Origin Name')).toBeInTheDocument();
    expect(screen.getByText('Location Name')).toBeInTheDocument();
  });

  test('handles close button click correctly', () => {
    render(<Details />);

    const closeButton = screen.getByText('Close details');
    fireEvent.click(closeButton);

    expect(mockPush).toHaveBeenCalledWith(
      {
        pathname: '/',
        query: {},
      },
      undefined,
      { shallow: true }
    );
  });
});