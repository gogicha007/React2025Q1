import { configureStore } from '@reduxjs/toolkit';

import countriesReducer from '../state/features/countries/countriesSlice';
import plainFormReducer from '../state/features/plain-form/plainFormSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    plainForm: plainFormReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
