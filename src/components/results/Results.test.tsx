import { render } from '@testing-library/react';
import Results from './Results';

test('results', () => {
  jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useSearchParams: () => [new URLSearchParams({ ids: '001,002' })],
  }));
  render(<Results loader={true} />);
});
