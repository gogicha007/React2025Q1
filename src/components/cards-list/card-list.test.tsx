import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@/state/store'; 
import Results from './CardList';
import { mockData } from '@/utils/test-utils/mocks/mock_data';
import { IResponse, ICharacterDetails } from '../../types/interface';

// Mock the useSelector and useRouter hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Card component to simplify testing
jest.mock('../card/card', () => ({
  Card: jest.fn(() => <div data-testid="card" />),
}));

// Mock PickCards component to simplify testing
jest.mock('../../state/features/pickCards/PickCards', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="pick-cards" />),
}));

const mockUseRouter = require('next/router').useRouter;
const mockUseSelector = require('react-redux').useSelector;

describe('Results Component', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      query: {},
      push: jest.fn(),
    });
    mockUseSelector.mockReturnValue([]); // Mocking an empty selectedCards array for now
  });

  it('renders cards based on data', () => {
    render(
      <Provider store={setupStore()}>
        <Results {...mockData} />
      </Provider>
    );
    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(2); // Check if two cards are rendered
  });

  it('clicking on a card updates the URL query', () => {
    render(
      <Provider store={setupStore()}>
        <Results {...mockData} />
      </Provider>
    );

    const card = screen.getAllByTestId('card')[0];
    fireEvent.click(card);

    expect(mockUseRouter().push).toHaveBeenCalledWith(
      {
        pathname: '/',
        query: { id: '1' }, // Check if the URL query is updated with the card id
      },
      undefined,
      { shallow: true }
    );
  });

  it('displays PickCards component when there are selected cards', () => {
    // Mock selectedCards state with some data
    mockUseSelector.mockReturnValue([ { id: '1', name: 'Selected Card' } ]);

    render(
      <Provider store={setupStore()}>
        <Results {...mockData} />
      </Provider>
    );

    expect(screen.getByTestId('pick-cards')).toBeInTheDocument(); // PickCards should be rendered
  });

  it('applies "selected" class when card is selected', () => {
    // Mock selected card query in the router
    mockUseRouter.mockReturnValue({
      query: { id: '1' },
      push: jest.fn(),
    });

    render(
      <Provider store={setupStore()}>
        <Results {...mockData} />
      </Provider>
    );

    const selectedCard = screen.getByText('Character 1').closest('.card-wrapper');
    expect(selectedCard).toHaveClass('selected');
  });
});
