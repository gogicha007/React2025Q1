import './mockSetup';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const mockServer = () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.resetHandlers());
  afterAll(() => server.close);

  return server;
};
