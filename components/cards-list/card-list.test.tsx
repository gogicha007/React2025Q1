import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import Results from './CardList';
import { configureStore } from '@reduxjs/toolkit';
import { mockData } from 'components/test-utils/mocks/mock_data';
import { ICharacterDetails } from 'types/interface';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../card/Card', () => ({
  Card: (props: ICharacterDetails) => (
    <div data-testid={`card-${props.id}`}>Mocked Card</div>
  ),
}));

jest.mock('../../state/features/pickCards/PickCards', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="pick-cards" />),
}));

const mockUseRouter = require('next/router').useRouter;

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
    mockUseRouter.mockReturnValue({
      query: {},
      push: mockPush,
    });
  });

  it('renders cards based on data', () => {
    renderWithProviders(<Results {...mockData} />);
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getAllByRole('card')).toHaveLength(6);
  });

  it('clicking on a card updates the URL query', () => {
    renderWithProviders(<Results {...mockData} />);

    const card = screen.getAllByRole('card')[0];
    fireEvent.click(card);

    expect(mockUseRouter().push).toHaveBeenCalledWith(
      {
        pathname: '/',
        query: { id: 1 },
      },
      undefined,
      { shallow: true }
    );
  });

  it('displays PickCards(flyout) component when there are selected cards', () => {
    const store = setupStore([1]);
    renderWithProviders(<Results {...mockData} />, store);

    expect(screen.getByTestId('pick-cards')).toBeInTheDocument();
  });
});
