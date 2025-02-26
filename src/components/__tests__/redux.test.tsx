import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router';
import { enableFetchMocks } from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import { toggleCardSelection } from '../../state/checkCards/selectedCardsSlice';
import Results from '../cardsList/cardsList';
import { setupStore } from '../../state/store';
import { Card } from '../card/card';
import { mockReduxData } from '../../utils/test-utils/mocks/mock_data';
import Papa from 'papaparse';

beforeAll(() => {
  enableFetchMocks();
});

beforeEach(() => {
  global.Blob = jest.fn((blobParts?: BlobPart[], options?: BlobPropertyBag) => {
    return Object.assign(Object.create(Blob.prototype), {
      size:
        blobParts?.reduce((acc, part) => acc + (part as string).length, 0) || 0,
      type: options?.type || '',
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
      slice: jest.fn(),
      stream: jest.fn(),
      text: jest.fn().mockResolvedValue(''),
    });
  }) as unknown as typeof Blob;

  URL.createObjectURL = jest.fn(() => 'mock-url');
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('Testing Redux store functionality', () => {
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
    const store = setupStore({ selectedCards: { selectedCards: [1] } });
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

  test('generate a CSV file when the download button is clicked', async () => {
    jest.mock('papaparse', () => ({
      unparse: jest.fn(
        () =>
          'ID,Name,Image,Species,Status\n1,Test Card,test-image.jpg,Test,Alive'
      ),
    }));
    jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => document.createElement('div'));

    jest.spyOn(global.URL, 'createObjectURL').mockReturnValue('mock-url');
    global.URL.revokeObjectURL = jest.fn();
    jest
      .spyOn(global, 'Blob')
      .mockImplementation(
        (blobParts?: BlobPart[], options?: BlobPropertyBag) => {
          const content = blobParts?.join('') || '';
          return {
            size: content.length,
            type: options?.type,
            text: async () => content,
          } as Blob;
        }
      );

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockImplementation(
      async (): Promise<Response> =>
        new Response(JSON.stringify(mockReduxData), { status: 200 })
    );

    const initialState = { selectedCards: { selectedCards: [1] } };
    const mockStore = setupStore(initialState);

    const router = createMemoryRouter(
      [{ path: '/', element: <Results loader={true} /> }],
      { initialEntries: ['?page=1&status=alive'] }
    );

    render(
      <Provider store={mockStore}>
        <RouterProvider router={router} />
      </Provider>
    );

    await waitFor(() => screen.findAllByRole('link'));

    // check if download button is not disabled
    const downloadButton = screen.getByText(/Download CSV/i);
    expect(downloadButton).not.toBeDisabled();

    const expectedData = [
      {
        ID: 1,
        Name: 'Test Card',
        Image: 'test-image.jpg',
        Species: 'Test',
        Status: 'Alive',
      },
    ];
    const expectedCSV = Papa.unparse(expectedData, {
      quotes: true,
      header: true,
    });

    fireEvent.click(downloadButton);

    await waitFor(() => {
      const blobCalls = (global.Blob as jest.Mock).mock.calls;
      expect(blobCalls.length).toBeGreaterThan(0);

      const blobContent = blobCalls[0][0][0];
      expect(blobContent).toBe(expectedCSV);
    });

    expect(URL.createObjectURL).toHaveBeenCalled();
    const createObjectURLCalls = (URL.createObjectURL as jest.Mock).mock.calls;
    expect(createObjectURLCalls[0][0]).toEqual({
      size: expect.any(Number),
      type: 'text/csv;charset=utf-8;',
      text: expect.any(Function),
    });

    // check if the file with right name is downloaded
    const downloadLink = document.querySelector('a[download]');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink?.getAttribute('download')).toBe('1_characters.csv');
    expect((downloadLink as HTMLAnchorElement).href).toContain('mock-url');
  });
});
