import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';

jest.mock('../../hooks/useCharacterFilter', () => ({
  useCharacterFilters: jest.fn(),
}));


jest.mock('../utils/validator', () => ({
  isValidHTTPURL: jest.fn((url) => {
    if (url === 'invalid-url') return false;
    return url && typeof url === 'string';
  }),
}));

describe('Pagination Component', () => {
  const mockSetParams = jest.fn();
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCharacterFilters as jest.Mock).mockReturnValue({
      page: '1',
      setFilters: mockSetFilters,
    });
  });

  test('renders pagination buttons correctly', () => {
    render(
      <Pagination
        resInfo={{
          prev: 'https://api.example.com/?page=1&status=alive',
          next: 'https://api.example.com/?page=3&status=alive',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    const nextButton = screen.getByText('»');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test('disables prev button when no previous page exists', () => {
    render(
      <Pagination
        resInfo={{
          prev: null,
          next: 'https://api.example.com/?page=2&status=alive',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    const nextButton = screen.getByText('»');

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test('disables next button when no next page exists', () => {
    render(
      <Pagination
        resInfo={{
          prev: 'https://api.example.com/?page=1&status=alive',
          next: '',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    const nextButton = screen.getByText('»');

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test('handles click on previous page button correctly', () => {
    render(
      <Pagination
        resInfo={{
          prev: 'https://api.example.com/?page=1&status=alive',
          next: 'https://api.example.com/?page=3&status=alive',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    fireEvent.click(prevButton);

    expect(mockSetFilters).toHaveBeenCalledWith({ page: 1, status: 'alive' });
  });

  test('handles click on next page button correctly', () => {
    render(
      <Pagination
        resInfo={{
          prev: 'https://api.example.com/?page=1&status=dead',
          next: 'https://api.example.com/?page=3&status=dead',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const nextButton = screen.getByText('»');
    fireEvent.click(nextButton);

    expect(mockSetFilters).toHaveBeenCalledWith({ page: 3, status: 'dead' });
  });

  test('respects disabled prop when set to true', () => {
    render(
      <Pagination
        disabled={true}
        resInfo={{
          prev: 'https://api.example.com/?page=1',
          next: 'https://api.example.com/?page=3',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    const nextButton = screen.getByText('»');

    expect(prevButton.style.pointerEvents).toBe('none');
    expect(nextButton.style.pointerEvents).toBe('none');
  });

  test('handles invalid URL gracefully', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (useCharacterFilters as jest.Mock).mockReturnValue({
      page: '2',
      setFilters: mockSetFilters,
    });

    render(
      <Pagination
        resInfo={{
          prev: 'invalid-url',
          next: 'https://api.example.com/?page=3&satus=alive',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    fireEvent.click(prevButton);
    expect(consoleSpy).toHaveBeenCalledWith('URL string is not valid');
    expect(mockSetFilters).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('handles missing page parameter in URL', () => {
    render(
      <Pagination
        resInfo={{
          prev: 'https://api.example.com/',
          next: 'https://api.example.com/?page=3',
          count: 100,
          pages: 10,
        }}
        setParams={mockSetParams}
      />
    );

    const prevButton = screen.getByText('«');
    fireEvent.click(prevButton);

    expect(mockSetFilters).toHaveBeenCalledWith({ page: 1, status: '' });
  });
});
