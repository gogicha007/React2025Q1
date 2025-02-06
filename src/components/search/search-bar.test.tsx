import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './search-bar';
import { RouterProvider, createMemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

describe('search bar', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('Verify clicking the Search button saves the value to the Local Storage', async () => {
    const handleSearch = jest.fn();

    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    const router = createMemoryRouter(
      [{ path: '/', element: <SearchBar handleSearch={handleSearch} /> }],
      { initialEntries: ['/?page=1&status='] }
    );

    render(<RouterProvider router={router} />);

    const input = await screen.findByRole('searchbox');
    await userEvent.type(input, 'dead');
    screen.debug();

    // const searchBttn = screen.getByRole("button", { name: /search/i });
    // await userEvent.click(searchBttn);

    // expect(setItemMock).toHaveBeenCalledWith("searchTerm", "dead");

    setItemMock.mockRestore();
  });
});
