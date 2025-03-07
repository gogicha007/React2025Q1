import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';  
import { useGetDetailsQuery } from '../../state/features/characters/charactersApiSlice';
import Details from './Details';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
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
  const mockUseGetDetailsQuery = useGetDetailsQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
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
    const mockSearchParams = {
      get: jest.fn().mockReturnValue('1'),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Details />);

    const closeButton = screen.getByText('Close details');
    fireEvent.click(closeButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});