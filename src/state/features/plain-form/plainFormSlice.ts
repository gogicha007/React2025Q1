import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  name: string;
  age: number;
  email: string;
  password1: string;
  password2: string;
  TC: boolean;
  file: File | string | null;
  country: string;
  gender: string;
}

interface PlainFormState {
  plainFormData: FormData;
  isDataChanged: boolean;
}
const initialState: PlainFormState = {
  plainFormData: {
    name: '',
    age: 0,
    email: '',
    password1: '',
    password2: '',
    TC: false,
    file: null,
    country: '',
    gender: '',
  },
  isDataChanged: false,
};

const plainFormSlice = createSlice({
  name: 'plainForm',
  initialState,
  reducers: {
    savePlainFormData(state, action: PayloadAction<FormData>) {
      if (JSON.stringify(state) !== JSON.stringify(action.payload)) {
        state.plainFormData = action.payload;
        state.isDataChanged = true;
      } else {
        state.isDataChanged = false;
      }
    },
    resetIsDataChanged(state) {
      state.isDataChanged = false;
    },
  },
});

export const { savePlainFormData, resetIsDataChanged } = plainFormSlice.actions;
export default plainFormSlice.reducer;
