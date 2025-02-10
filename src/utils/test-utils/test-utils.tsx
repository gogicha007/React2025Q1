import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
// import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';

import type { AppStore, RootState } from '../../state/store';
import { setupStore } from '../../state/store';

// As a basic setup, import your same slice reducers
// import selectedCardsReducer from './checkCards/selectedCardsSlice';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
