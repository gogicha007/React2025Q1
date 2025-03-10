import { configureStore } from '@reduxjs/toolkit';

import countriesReducer from '../state/features/countries/countriesSlice';

export const store = configureStore({
  reducer: { countries: countriesReducer },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
