import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router';
// import userEvent from '@testing-library/user-event';
import { mockStore } from '../../utils/test-utils/mocks/mock-store';
import { Provider } from 'react-redux';
import { toggleCardSelection } from '../../state/checkCards/selectedCardsSlice';
import Results from '../cardsList/cardsList';
import { setupStore } from '../../state/store';
import { Card } from '../card/card';

describe('Results Component', () => {
  test('Shows flyout when at least one card is selected', async () => {
    const store = setupStore();
    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );

    // Initial render, flyout not visible
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(screen.queryByText(/items selected/i)).not.toBeInTheDocument();

    // Dispatch redux action to select a card
    store.dispatch(toggleCardSelection(1));

    // Render after selecting a card
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    const selectedItems = screen.getAllByText(/items selected: 1/i);
    expect(selectedItems.length).toBeGreaterThan(0);
    selectedItems.forEach((element) => expect(element).toBeInTheDocument());
  });

  test('Hides flyout when no cards are selected', async () => {
    const store = setupStore({ selectedCards: { selectedCards: [1] } });
    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );
    // initial render as 1 item selected
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    // check the flyout element is visible
    expect(screen.getByText(/items selected: 1/i)).toBeInTheDocument();

    // deselect the card and check if element hides
    store.dispatch(toggleCardSelection(1));

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    // flyout element should be hidden
    expect(screen.queryByText(/items selected/i)).not.toBeInTheDocument();
  });

  test('deselect button clears selected items', () => {
    const store = mockStore({
      selectedCards: { selectedCards: [1] }, // Mock selected card ID = 1
    });
    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      {
        initialEntries: ['?page=1&status=dead'],
      }
    );
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    // "Items selected" text appears
    expect(screen.getByText(/items selected: 1/i)).toBeInTheDocument();

    // click "Deselect all" button
    const deselectButton = screen.getByText(/deselect all/i);
    fireEvent.click(deselectButton);

    // check if "Items selected" removed
    expect(screen.queryByText(/items selected: 1/i)).not.toBeInTheDocument();
  });
  test('When user unselects an item, it should be removed from the store', () => {
    // Initially 1 card selected
    const initialState = { selectedCards: { selectedCards: [1] } };
    const mockStore = setupStore(initialState);
    render(
      <Provider store={mockStore}>
        <Card
          id={1}
          name="Test Card"
          image="test-image.jpg"
          species="Test"
          status="Alive"
        />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    // check if checkbox is checked initially as the card is selected
    expect(checkbox.checked).toBe(true);

    // click on checkbox to deselect card
    fireEvent.click(checkbox);

    const updatedState = mockStore.getState();

    // check if the card ID is removed from the selected cards array
    expect(updatedState.selectedCards.selectedCards).not.toContain(1);
  });
});
