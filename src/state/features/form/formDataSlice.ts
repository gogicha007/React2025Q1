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

interface FormState {
  formData: FormData[];
  isDataChanged: boolean;
}

const initialState: FormState = {
  formData: [],
  isDataChanged: false,
};

const formDataSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData(state, action: PayloadAction<FormData>) {
      state.formData.push(action.payload);
      state.isDataChanged = true;
    },
    resetIsDataChanged(state) {
      state.isDataChanged = false;
    },
  },
});

export const { addFormData, resetIsDataChanged } = formDataSlice.actions;
export default formDataSlice.reducer;
