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
  reason: string; // Jalur pendaftaran
  option: string;   // Opsi jalur pendaftaran
  price: string;    // Tambahkan properti price
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
  option: '',
  price: '', // Inisialisasi price
  email: '',
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
