import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import Results from '../cards-list/CardList';
import { configureStore } from '@reduxjs/toolkit';
import { mockData } from '@/utils/test-utils/mocks/mock_data';
import { ICharacterDetails } from '@/types/interface';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// jest.mock('../card/card', () => ({
//   Card: jest.fn(() => <div data-testid="card" />),
// }));
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

  it('displays PickCards component when there are selected cards', () => {
    const store = setupStore([1]);
    renderWithProviders(<Results {...mockData} />, store);

    expect(screen.getByTestId('pick-cards')).toBeInTheDocument();
  });

  it('applies "selected" class when card is selected', async () => {
    const { rerender } = renderWithProviders(<Results {...mockData} />);

    const firstCard = screen.getAllByRole('card')[0];

    // Ensure the card is not selected initially
    expect(firstCard).not.toHaveClass('selected');

    // Simulate click on the first card
    await act(async()=>{fireEvent.click(firstCard)});

    // Verify that router.push is called with the correct query
    expect(mockPush).toHaveBeenCalledWith(
      {
        pathname: '/',
        query: { id: 1 },
      },
      undefined,
      { shallow: true }
    );

    // Simulate the router state update by changing the mock return value
    mockUseRouter.mockReturnValue({
      query: { id: 1 },
      push: mockPush,
    });

    // Re-render the component to reflect the updated router state
    await act(async () => {
      rerender(
        <Provider store={setupStore()}>
          <Results {...mockData} />
        </Provider>
      );
    });
    screen.debug()
    // Now the first card should have the 'selected' class
    expect(screen.getAllByRole('card')[0]).toHaveClass('selected');
  });
});
