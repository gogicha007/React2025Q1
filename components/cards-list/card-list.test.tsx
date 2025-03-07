import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Results from './CardList';
import { mockData } from '../test-utils/mocks/mock_data';
import { useRouter, useSearchParams } from 'next/navigation';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../state/features/pickCards/PickCards', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="pick-cards" />),
}));

describe('Results Component', () => {
  const mockPush = jest.fn();
  const setupStore = (selectedCards: number[] = []) => {
    return configureStore({
      reducer: {
        selectedCards: () => ({ selectedCards }),
      },
    });
  };
  const renderWithProviders = (ui: React.ReactNode, store = setupStore()) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  beforeEach(() => {
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: {},
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
    });
  });

  test('renders cards based on data', () => {
    renderWithProviders(<Results {...mockData} />);
    const cards = screen.getAllByRole('card');
    expect(cards).toHaveLength(6);
    expect(screen.getByText('card 1')).toBeInTheDocument();
    expect(screen.getByText('card 2')).toBeInTheDocument();
  });

  test('clicking a card updates the URL query', () => {
    renderWithProviders(<Results {...mockData} />);

    const card = screen.getAllByRole('card')[0];
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('id=1'))
  });

  test('displays PickCards component when there are selected cards', () => {
    const store = setupStore([1]);
    renderWithProviders(<Results {...mockData} />, store);

    expect(screen.getByTestId('pick-cards')).toBeInTheDocument();
  });
});
