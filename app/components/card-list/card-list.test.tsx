import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Results from './CardList';
import { mockData, mockNoData } from '../../test_utils/mocks/mock-data';
import type { ICharacterDetails } from '~/types/interface';

jest.mock('../card/Card', () => ({
  Card: (props: ICharacterDetails) => (
    <div data-testid={`card-${props.id}`}>Mocked Card</div>
  ),
}));

jest.mock('../../state/features/pickCards/PickCards', () => ({
  __esModule: true,
  default: () => <div data-testid="pick-cards">Mocked PickCards</div>,
}));

const mockUseLocation = jest.fn();
mockUseLocation.mockReturnValue({ search: '' });

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => mockUseLocation(),
}));

describe('Results Component', () => {
  const setupStore = (selectedCards: number[] = []) => {
    return configureStore({
      reducer: {
        selectedCards: () => ({ selectedCards }),
      },
    });
  };

  const renderWithProviders = (ui: React.ReactNode, store = setupStore()) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={ui} />
            <Route path="/:id" element={<div>Character Details</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders all character cards', () => {
    renderWithProviders(<Results {...mockData} />);

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  test('does not render PickCards(flyout) when no cards are selected', () => {
    renderWithProviders(<Results {...mockData} />);

    expect(screen.queryByTestId('pick-cards')).not.toBeInTheDocument();
  });

  test('renders PickCards(flyout) when cards are selected', () => {
    const store = setupStore([1]);
    renderWithProviders(<Results {...mockData} />, store);

    expect(screen.getByTestId('pick-cards')).toBeInTheDocument();
  });

  test('links have correct pathname and search params', () => {
    renderWithProviders(<Results {...mockData} />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/1');
    expect(links[1]).toHaveAttribute('href', '/2');
  });

  test('clicking a card link logs the detailsOpen state and navigates', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    renderWithProviders(<Results {...mockData} />);

    const firstCardLink = screen.getAllByRole('link')[0];
    fireEvent.click(firstCardLink);

    expect(consoleSpy).toHaveBeenCalledWith('false');

    consoleSpy.mockRestore();
  });

  test('handles empty results correctly', () => {
    renderWithProviders(<Results {...mockNoData} />);

    expect(screen.queryByRole('card')).not.toBeInTheDocument();
  });

  test('cards have the correct role', () => {
    renderWithProviders(<Results {...mockData} />);

    const cards = screen.getAllByRole('card');
    expect(cards).toHaveLength(6);
  });
});
