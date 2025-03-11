import { configureStore } from '@reduxjs/toolkit';

import countriesReducer from '../state/features/countries/countriesSlice';
import formDataSlice from '../state/features/form/formDataSlice';
import plainFormReducer from '../state/features/plain-form/plainFormSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    formData: formDataSlice,
    plainForm: plainFormReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
