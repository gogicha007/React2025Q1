import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICountry } from '../../../types/interface';

export interface CountryState {
  value: string;
  countries: ICountry[];
}

const initialState: CountryState = {
  value: 'country',
  countries: [
    ICountry.USA,
    ICountry.TURKEY,
    ICountry.GERMANY,
    ICountry.FRANCE,
    ICountry.ITALY,
    ICountry.SPAIN,
    ICountry.UK,
    ICountry.NETHERLANDS,
    ICountry.BELGIUM,
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
