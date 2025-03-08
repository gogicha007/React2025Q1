import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';
import { useCharacterFilters } from '../../hooks/useCharacterFilters';

jest.mock('../../hooks/useCharacterFilters');

const mockHandleSearch = jest.fn();

describe('SearchBar Component', () => {
  beforeEach(() => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: '',
    });
    mockHandleSearch.mockClear();
  });

  test('renders SearchBar component', () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);
    expect(screen.getByLabelText(/search by status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls handleSearch with correct parameters when form is submitted', () => {
    render(<SearchBar handleSearch={mockHandleSearch} />);
    const inputElement = screen.getByRole('searchbox');
    fireEvent.change(inputElement, { target: { value: 'alive' } });
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(mockHandleSearch).toHaveBeenCalledWith({ page: 1, status: 'alive' });
  });

  test('uses the status from useCharacterFilters as the default value', () => {
    (useCharacterFilters as jest.Mock).mockReturnValue({
      status: 'dead',
    });
    render(<SearchBar handleSearch={mockHandleSearch} />);
    const inputElement = screen.getByRole('searchbox');
    expect(inputElement).toHaveValue('dead');
  });
});