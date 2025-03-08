import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createRoutesStub } from 'react-router';
import Details from '../routes/details';
import { ICharacterDetails, IQueryError } from '../types/interface';
import { mockCharacter } from '../test_utils/mocks/mock-data';

global.fetch = jest.fn();

const mockQueryError: IQueryError = {
  status: 404,
  data: { error: 'Character not found' },
};

const renderComponent = (data: ICharacterDetails | IQueryError) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(data),
  });

  const Stub = createRoutesStub([
    {
      path: '/:id',
      Component: Details,
      loader: () => data,
    },
  ]);

  return render(<Stub initialEntries={['/1']} />);
};

test('renders character details correctly', async () => {
  renderComponent(mockCharacter);

  await waitFor(() => {
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('details 1')).toBeInTheDocument();
    expect(
      screen.getByText('location 1')
    ).toBeInTheDocument();
  });
});

test('renders error message when character is not found', async () => {
  renderComponent(mockQueryError);

  await waitFor(() => {
    expect(screen.getByText('Character not found')).toBeInTheDocument();
  });
});