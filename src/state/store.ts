import { configureStore } from '@reduxjs/toolkit';

import countriesReducer from '../state/features/countries/countriesSlice';
import formDataSlice from '../state/features/form/formDataSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    formData: formDataSlice,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
