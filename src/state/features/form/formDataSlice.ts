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
  justAdded?: boolean;
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
      state.formData.forEach((item) => (item.justAdded = false));
      state.formData.push({ ...action.payload, justAdded: true });
      state.isDataChanged = true;
    },
    resetIsDataChanged(state) {
      state.isDataChanged = false;
    },
    resetJustAdded(state) {
      state.formData.forEach((item) => (item.justAdded = false));
    },
  },
});

export const { addFormData, resetIsDataChanged, resetJustAdded } =
  formDataSlice.actions;
export default formDataSlice.reducer;
