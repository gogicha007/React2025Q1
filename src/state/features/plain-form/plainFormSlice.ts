import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  name: string;
  age: number;
  email: string;
  password1: string;
  password2: string;
  TC: boolean;
  file: File | null;
  country: string;
  gender: string;
}

const initialState: FormData = {
  name: '',
  age: 0,
  email: '',
  password1: '',
  password2: '',
  TC: false,
  file: null,
  country: '',
  gender: '',
};

const plainFormSlice = createSlice({
  name: 'plainForm',
  initialState,
  reducers: {
    savePlainFormData(state, action: PayloadAction<FormData>) {
      state.name = action.payload.name;
      state.age = action.payload.age;
      state.email = action.payload.email;
      state.password1 = action.payload.password1;
      state.password2 = action.payload.password2;
      state.TC = action.payload.TC;
      state.file = action.payload.file;
      state.country = action.payload.country;
      state.gender = action.payload.gender;
    },
  },
});

export const { savePlainFormData } = plainFormSlice.actions;
export default plainFormSlice.reducer;
