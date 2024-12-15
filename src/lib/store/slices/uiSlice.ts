import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  error: string | null;
}

const storedTheme = localStorage.getItem('theme');
const validTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';

const initialState: UIState = {
  theme: validTheme,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { toggleTheme, setError, clearError } = uiSlice.actions;

export default uiSlice.reducer;
