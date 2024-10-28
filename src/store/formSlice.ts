// src/store/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  fullName: string;
  birthDate: string | null;
  phone: string;
  infoSource: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  address: string;
  reason: string;
  category: string; // Jalur pendaftaran
  option: string;   // Opsi jalur pendaftaran
  email: string;
}

const initialState: FormState = {
  fullName: '',
  birthDate: null,
  phone: '',
  infoSource: '',
  province: '',
  regency: '',
  district: '',
  village: '',
  address: '',
  reason: '',
  category: '',
  option: '',
  email:'',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<FormState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = formSlice.actions;
export default formSlice.reducer;
