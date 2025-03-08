import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createRoutesStub, useNavigate, useOutletContext } from 'react-router';
import Details from '../routes/details';
import { ICharacterDetails, IQueryError } from '../types/interface';
import { mockCharacter } from '../test_utils/mocks/mock-data';

global.fetch = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useOutletContext: jest.fn(),
}));

const mockQueryError: IQueryError = {
  status: 404,
  data: { error: 'Character not found' },
};

const renderComponent = (
  data: ICharacterDetails | IQueryError,
  context = { closeClicked: jest.fn(), counter: 1 }
) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(data),
  });

  (useOutletContext as jest.Mock).mockReturnValue(context);
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const Stub = createRoutesStub([
    {
      path: '/:id',
      Component: Details,
      loader: () => data,
    },
  ]);

  return { ...render(<Stub initialEntries={['/1']} />), mockNavigate, context };
};

test('renders character details correctly', async () => {
  renderComponent(mockCharacter);

  await waitFor(() => {
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('details 1')).toBeInTheDocument();
    expect(screen.getByText('location 1')).toBeInTheDocument();
  });
});

test('renders error message when character not found', async () => {
  renderComponent(mockQueryError);

  await waitFor(() => {
    expect(screen.getByText('Character not found')).toBeInTheDocument();
  });
});

test('handles close button click correctly', async () => {
  const { mockNavigate, context } = renderComponent(mockCharacter);

  await waitFor(() => {
    expect(screen.getByAltText('image')).toBeInTheDocument();
  });

  const closeButton = screen.getByText('Close details');
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(context.closeClicked).toHaveBeenCalled();
  });
});
