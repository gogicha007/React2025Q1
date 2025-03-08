import '@testing-library/jest-dom';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Card } from './Card';
import { toggleCardSelection } from '../../state/features/pickCards/selectedCardsSlice';
import { mockCharacter } from '../../test_utils/mocks/mock-data';

jest.mock('../../state/features/pickCards/selectedCardsSlice', () => ({
  toggleCardSelection: jest.fn(() => ({ type: 'mock/toggleCardSelection' })),
}));

describe('Card Component', () => {
  const setupStore = (selectedCards: number[] = []) => {
    return configureStore({
      reducer: {
        selectedCards: (state = { selectedCards }) => state,
      },
    });
  };

  test('renders card with character information', async () => {
    const store = setupStore();

    render(
      <Provider store={store}>
        <Card {...mockCharacter} />
      </Provider>
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://images/rick.jpg');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('shows checked checkbox when card is selected', () => {
    const store = setupStore([1]);
    render(
      <Provider store={store}>
        <Card {...mockCharacter} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('dispatches toggleCardSelection when checkbox is clicked', () => {
    const store = setupStore();

    render(
      <Provider store={store}>
        <Card {...mockCharacter} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(toggleCardSelection).toHaveBeenCalledWith(1);
  });

  test('stops event propagation when checkbox is clicked', () => {
    const store = setupStore();

    render(
      <Provider store={store}>
        <Card {...mockCharacter} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    const event = createEvent.click(checkbox);
    jest.spyOn(event, 'stopPropagation');

    fireEvent(checkbox, event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });

  test('has the correct accessibility role', () => {
    const store = setupStore();

    render(
      <Provider store={store}>
        <Card {...mockCharacter} />
      </Provider>
    );

    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
