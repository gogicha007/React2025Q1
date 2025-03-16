import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICountry } from '../../../types/interface';

export interface CountryState {
  value: string;
  countries: ICountry[];
}

const initialState: CountryState = {
  value: 'country',
  countries: [
    { code: 'USA', name: 'United States' },
    { code: 'TUR', name: 'Turkey' },
    { code: 'DEU', name: 'Germany' },
    { code: 'FRA', name: 'France' },
    { code: 'ITA', name: 'Italy' },
    { code: 'ESP', name: 'Spain' },
    { code: 'GBR', name: 'United Kingdom' },
    { code: 'NLD', name: 'Netherlands' },
    { code: 'BEL', name: 'Belgium' },
  ],
};

export const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    changeCountry: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export default countriesSlice.reducer;
